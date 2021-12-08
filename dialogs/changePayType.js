const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const messagesPay = require('../bots/resources/messagesPay.js');
const { CheckDate } = require('./checkDate.js');
const CHECK_DATE = 'checkDate';
const CHANGE_PAY = 'changePayType';
class ChangePayType extends ComponentDialog {
    constructor(id) {
        super(id || CHANGE_PAY);
        this.addDialog(new CheckDate(CHECK_DATE))
            .addDialog(new WaterfallDialog(CHANGE_PAY, [
                this.initialStep.bind(this)
            ]));

        this.initialDialogId = CHANGE_PAY;
    }

    async initialStep(stepContext) {
        // to do ler entities;
        const cheque = false;
        const boleto = false;
        const dinheiro = false;
        const cartao = false;
        // .entities.cheque
        if (cheque || boleto || dinheiro) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.formaInformada);
            await stepContext.replaceDialog(CHECK_DATE);
        } else {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.formaNaoInformada);
            if (cheque || boleto || dinheiro) {
                await stepContext.replaceDialog(CHECK_DATE);
            } else {
                if (cartao) {
                    await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoCartao);
                    await stepContext.context.sendActivity(messagesPay.messagesFluxo.formasValidas);
                    if (cartao) {
                        await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoNaoCartao);
                        await stepContext.cancelAllDialogs();
                    }
                    if (cheque || boleto || dinheiro) {
                        await stepContext.replaceDialog(CHECK_DATE);
                    }
                }
            }
        } return stepContext.endDialog();
    }
}
module.exports.ChangePayType = ChangePayType;
