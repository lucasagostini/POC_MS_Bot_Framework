const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { UserService } = require('./userService.js');
const messagesPay = require('../bots/resources/messagesPay.js');
const TO_OPEN_TICKET = 'toOpenTicket';

class ToOpenTicket extends ComponentDialog {
    constructor(id, userState) {
        super(id || TO_OPEN_TICKET);
        this.addDialog(new WaterfallDialog(TO_OPEN_TICKET, [
            this.initialStep.bind(this)
        ]));
        this.userService = new UserService();
        this.userState = userState;
        this.initialDialogId = TO_OPEN_TICKET;
    }

    async initialStep(stepContext) {
        await stepContext.context.sendActivity(messagesPay.messagesFluxo.abrindoChamado);
        // abrirTicket(usuario do userstate)
        if (this.userService.addTicket()) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.abriuChamado);
        } else {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.naoAbriuChamado);
        } return stepContext.endDialog();
    }
}
module.exports.ToOpenTicket = ToOpenTicket;
