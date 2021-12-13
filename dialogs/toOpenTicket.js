const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { UserService } = require('./userService.js');
const messagesPay = require('../bots/resources/messagesPay.js');
const TO_OPEN_TICKET = 'toOpenTicket';

class ToOpenTicket extends ComponentDialog {
    constructor(id, userState, luisRecognizer) {
        super(id || TO_OPEN_TICKET);
        this.addDialog(new WaterfallDialog(TO_OPEN_TICKET, [
            this.initialStep.bind(this)
        ]));
        this.userService = new UserService();
        this.userState = userState;
        this.luisRecognizer = luisRecognizer;
        this.initialDialogId = TO_OPEN_TICKET;
    }

    async initialStep(stepContext) {
        await stepContext.context.sendActivity(messagesPay.messagesFluxo.abrindoChamado);
        this.usuario = this.userState.createProperty('usuario');
        const userData = await this.usuario.get(stepContext.context, { usuario: null });
        const ticketAdded = this.userService.addTicket(userData);
        if (ticketAdded) {
            return stepContext.context.sendActivity(messagesPay.messagesFluxo.abriuChamado + userData.ticketNumber.toString() + ' ' + messagesPay.messagesFluxo.abriuChamado2);
        } else {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoAbriuChamado);
        } return stepContext.endDialog();
    }
}
module.exports.ToOpenTicket = ToOpenTicket;
