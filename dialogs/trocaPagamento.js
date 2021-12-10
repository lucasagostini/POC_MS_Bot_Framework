const { ConfirmPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const messagesPay = require('../bots/resources/messagesPay.js');
const { ChangePayType } = require('./changePayType.js');
// const { index } = require('./authUser.js');
const { UserService } = require('./userService.js');
const CONFIRM_PROMPT = 'confirmPrompt';
const TROCA_PAGAMENTO = 'trocaPagamento';
const CHANGE_PAY = 'changePayType';

class TrocaPagamento extends ComponentDialog {
    constructor(id, userState) {
        super(id || TROCA_PAGAMENTO);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChangePayType(CHANGE_PAY, userState))
            .addDialog(new WaterfallDialog(TROCA_PAGAMENTO, [
                this.initialStep.bind(this),
                this.ticketOpened.bind(this),
                this.needHelp.bind(this)
            ]));
        this.userState = userState;
        this.userService = new UserService();
        this.initialDialogId = TROCA_PAGAMENTO;
    }

    async initialStep(stepContext) {
        return stepContext.next();
    }

    async ticketOpened(stepContext) {
        const ticket = this.userService.hasTicket(this.userState.usuario);
        if (ticket) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.ticketAberto);
            const atrasado = this.userService.lateTicket(this.userState.usuario);
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.chamado);
            if (atrasado) {
                await stepContext.context.sendActivity(messagesPay.messagesFluxo.atrasado);
            } return stepContext.prompt(CONFIRM_PROMPT, messagesPay.messagesFluxo.ajudaSolicitacao, ['Sim', 'Não']);
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
