const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const messagesPay = require('../bots/resources/messagesPay.js');
const { CheckDate } = require('./checkDate.js');
const { LuisRecognizer } = require('botbuilder-ai');

const CHECK_DATE = 'checkDate';
const CHANGE_PAY = 'changePayType';
const TEXT_PROMPT = 'textPrompt';

class ChangePayType extends ComponentDialog {
    constructor(id, userState, luisRecognizer) {
        super(id || CHANGE_PAY);
        this.addDialog(new CheckDate(CHECK_DATE, userState, luisRecognizer))
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(CHANGE_PAY, [
                this.initialStep.bind(this),
                this.middleStep.bind(this),
                this.afterMiddle.bind(this),
                this.finalStep.bind(this)
            ]));
        this.userState = userState;
        this.luisRecognizer = luisRecognizer;
        this.initialDialogId = CHANGE_PAY;
    }

    async initialStep(stepContext) {
        // if (cheque || boleto || dinheiro) {
        //    await stepContext.context.sendActivity(messagesPay.messagesFluxo.formaInformada);
        //    await stepContext.replaceDialog(CHECK_DATE);
        // } else {
        return stepContext.prompt(TEXT_PROMPT, messagesPay.messagesFluxo.formaNaoInformada);
        // } return stepContext.endDialog();
    }

    async middleStep(stepContext) {
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.result);
        if (LuisRecognizer.topIntent(luisResult) === 'PrazoPagamento') {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.okMas);
            return stepContext.prompt(TEXT_PROMPT, messagesPay.messagesFluxo.formaNaoInformada);
        } else {
            if (luisResult.entities.boleto || luisResult.entities.cheque || luisResult.entities.dinheiro) {
                return stepContext.replaceDialog(CHECK_DATE);
            } else {
                if (luisResult.entities.cartao) {
                    await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoCartao);
                    return stepContext.prompt(TEXT_PROMPT, messagesPay.messagesFluxo.formasValidas);
                }
            } // ver como lidar \/
            return stepContext.endDialog();
        }
    }

    async afterMiddle(stepContext) {
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.result);
        if (luisResult.entities.boleto || luisResult.entities.cheque || luisResult.entities.dinheiro) {
            return stepContext.replaceDialog(CHECK_DATE);
        } else {
            if (luisResult.entities.cartao) {
                await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoCartao);
                return stepContext.prompt(TEXT_PROMPT, messagesPay.messagesFluxo.formasValidas);
            }
        }
    }

    async finalStep(stepContext) {
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.result);
        if (luisResult.entities.boleto || luisResult.entities.cheque || luisResult.entities.dinheiro) {
            return stepContext.replaceDialog(CHECK_DATE);
        } else if (luisResult.entities.cartao) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoNaoCartao);
            return stepContext.cancelAllDialogs();
        }
    }
}
module.exports.ChangePayType = ChangePayType;
