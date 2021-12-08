// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
const { ComponentDialog, WaterfallDialog, NumberPrompt } = require('botbuilder-dialogs');
const messagesPay = require('../bots/resources/messagesPay.js');
const { ToOpenTicket } = require('./toOpenTicket.js');

const NUMBER_PROMPT = 'numberPrompt';
const TO_OPEN_TICKET = 'toOpenTicket';
const CHECK_DATE = 'checkDate';

class CheckDate extends ComponentDialog {
    constructor(id) {
        super(id || CHECK_DATE);
        this.addDialog(new ToOpenTicket(TO_OPEN_TICKET))
            .addDialog(new NumberPrompt(NUMBER_PROMPT))
            .addDialog(new WaterfallDialog(CHECK_DATE, [
                this.initialStep.bind(this),
                this.middleStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = CHECK_DATE;
    }

    async initialStep(stepContext) {
        const data = false;
        if (data) {
            return stepContext.replaceDialog(TO_OPEN_TICKET);
        } else {
            return stepContext.prompt(NUMBER_PROMPT, messagesPay.messagesFluxo.qualPrazo);
        }
    }

    async middleStep(stepContext) {
        if (stepContext.result >= 8) {
            return stepContext.prompt(NUMBER_PROMPT, messagesPay.messagesFluxo.prazoInvalido);
        } else {
            return stepContext.replaceDialog(TO_OPEN_TICKET);
        }
    }

    async finalStep(stepContext) {
        if (stepContext.result >= 8) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.prazoImpossivel);
            return stepContext.endDialog();
        } else {
            return stepContext.replaceDialog(TO_OPEN_TICKET);
        }
    }
}

module.exports.CheckDate = CheckDate;
