// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
// const { isEntity } = require('botframework-schema');
// const { DateResolverDialog } = require('./dateResolverDialog');
const messagesPay = require('../bots/resources/messagesPay.js');
const { ToOpenTicket } = require('./toOpenTicket.js');
const TO_OPEN_TICKET = 'toOpenTicket';
const CHECK_DATE = 'checkDate';
class CheckDate extends ComponentDialog {
    constructor(id) {
        super(id || CHECK_DATE);
        this.addDialog(new ToOpenTicket(TO_OPEN_TICKET))
            .addDialog(new WaterfallDialog(CHECK_DATE, [
                this.initialStep.bind(this)
            ]));

        this.initialDialogId = CHECK_DATE;
    }

    async initialStep(stepContext) {
        const data = false;
        const prazo = 9;
        if (data) {
            return stepContext.replaceDialog(TO_OPEN_TICKET);
        } else {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.qualPrazo);
            if (prazo >= 8) {
                await stepContext.context.sendActivity(messagesPay.messagesFluxo.prazoInvalido);
                if (prazo >= 8) {
                    await stepContext.context.sendActivity(messagesPay.messagesFluxo.prazoImpossivel);
                    return stepContext.endDialog();
                } else {
                    return stepContext.replaceDialog(TO_OPEN_TICKET);
                }
            } else {
                return stepContext.replaceDialog(TO_OPEN_TICKET);
            }
        }
    }
}

module.exports.CheckDate = CheckDate;
