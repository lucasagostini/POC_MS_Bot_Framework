const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const messagesPay = require('../bots/resources/messagesPay.js');
const { CheckDate } = require('./checkDate.js');
const CHECK_DATE = 'checkDate';
const CHANGE_PAY = 'changePayType';
const TEXT_PROMPT = 'textPrompt';
class ChangePayType extends ComponentDialog {
    constructor(id, userState) {
        super(id || CHANGE_PAY);
        this.addDialog(new CheckDate(CHECK_DATE, userState))
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(CHANGE_PAY, [
                this.initialStep.bind(this),
                this.middleStep.bind(this),
                this.finalStep.bind(this)
            ]));
        this.userState = userState;
        this.initialDialogId = CHANGE_PAY;
    }

    async initialStep(stepContext) {
        // to do ler entities;
        const cheque = false;
        const boleto = false;
        const dinheiro = false;
        // .entities.cheque
        if (cheque || boleto || dinheiro) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.formaInformada);
            await stepContext.replaceDialog(CHECK_DATE);
        } else {
            return stepContext.prompt(TEXT_PROMPT, messagesPay.messagesFluxo.formaNaoInformada, ['Cheque', 'Dinheiro', 'Boleto']);
        } return stepContext.endDialog();
    }

    async middleStep(stepContext) {
        const formaPagamento = stepContext.result;
        if (formaPagamento === 'cheque' || formaPagamento === 'boleto' || formaPagamento === 'dinheiro') {
            await stepContext.replaceDialog(CHECK_DATE);
        } else {
            if (formaPagamento === 'cartao') {
                await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoCartao);
                return stepContext.prompt(TEXT_PROMPT, messagesPay.messagesFluxo.formasValidas, ['Cheque', 'Dinheiro', 'Boleto']);
            }
        }
    }

    async finalStep(stepContext) {
        const formaPagamento = stepContext.result;
        if (formaPagamento === 'cartao') {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoNaoCartao);
            return stepContext.cancelAllDialogs();
        }
        if (formaPagamento === 'cheque' || formaPagamento === 'boleto' || formaPagamento === 'dinheiro') {
            return stepContext.replaceDialog(CHECK_DATE);
        }
    }
}
module.exports.ChangePayType = ChangePayType;
