const { ConfirmPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { messagesPay, msgTicket } = require('../bots/resources/messagesPay.js');
const { ChangePayType } = require('./changePayType.js');
const { UserService } = require('../services/userService.js');
const { TicketService } = require('../services/ticketService.js');

const CONFIRM_PROMPT = 'confirmPrompt';
const TROCA_PAGAMENTO = 'trocaPagamento';
const CHANGE_PAY = 'changePayType';

class TrocaPagamento extends ComponentDialog {
    constructor(id, userState, luisRecognizer) {
        super(id || TROCA_PAGAMENTO);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChangePayType(CHANGE_PAY, userState, luisRecognizer))
            .addDialog(new WaterfallDialog(TROCA_PAGAMENTO, [
                this.initialStep.bind(this),
                this.ticketOpened.bind(this),
                this.needHelp.bind(this)
            ]));
        this.userState = userState;
        this.ticketService = new TicketService();
        this.luisRecognizer = luisRecognizer;
        this.userService = new UserService();
        this.initialDialogId = TROCA_PAGAMENTO;
    }

    async initialStep(stepContext) {
        return stepContext.next();
    }

    async ticketOpened(stepContext) {
        const msg = messagesPay.messagesFluxo;
        this.usuario = this.userState.createProperty('usuario');
        const userData = await this.usuario.get(stepContext.context, { usuario: null });
        const ticket = this.ticketService.hasTicket(userData);
        if (ticket) {
            await stepContext.context.sendActivity(msg.ticketAberto);
            const atrasado = this.ticketService.lateTicket(userData);
            await stepContext.context.sendActivity(msgTicket());

            if (atrasado) {
                await stepContext.context.sendActivity(msg.atrasado);
            } return stepContext.prompt(CONFIRM_PROMPT, msg.ajudaSolicitacao, ['Sim', 'Não']);
        } else {
            return stepContext.replaceDialog(CHANGE_PAY);
        }
    }

    async needHelp(stepContext) {
        if (stepContext.result) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.resolverSolicitacao);
        } else {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.tudoBem);
        }
        return stepContext.endDialog();
    }
}

module.exports.TrocaPagamento = TrocaPagamento;
