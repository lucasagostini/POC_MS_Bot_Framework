// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
// const { isEntity } = require('botframework-schema');
// const { DateResolverDialog } = require('./dateResolverDialog');
const messagesPay = require('../bots/resources/messagesPay.js');
const TO_OPEN_TICKET = 'toOpenTicket';

class ToOpenTicket extends ComponentDialog {
    constructor(id) {
        super(id || TO_OPEN_TICKET);
        this.addDialog(new WaterfallDialog(TO_OPEN_TICKET, [
            this.initialStep.bind(this)
        ]));

        this.initialDialogId = TO_OPEN_TICKET;
    }

    async initialStep(stepContext) {
        await stepContext.context.sendActivity(messagesPay.messagesFluxo.abrindoChamado);
        if (abrirChamado()) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.abriuChamado);
        } else {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoAbriuChamado);
        } return stepContext.endDialog();
    }
}

function abrirChamado() {
    return true;
}
module.exports.ToOpenTicket = ToOpenTicket;
