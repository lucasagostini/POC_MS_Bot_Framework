// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { ConfirmPrompt, ComponentDialog, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { DateResolverDialog } = require('./dateResolverDialog');
// const messagesPay = require('./resources/trocaPagamento');
const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const TROCA_PAGAMENTO = 'trocaPagamento';

class TrocaPagamento extends ComponentDialog {
    constructor(id) {
        super(id || TROCA_PAGAMENTO);
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(TROCA_PAGAMENTO, [
                this.initialStep.bind(this),
                this.openticket(this),
                this.changePayType(this),
                this.changePayDate(this)
            ]));

        this.initialDialogId = TROCA_PAGAMENTO;
    }

    async initialStep(stepContext) {
        // pegar intent e informações da mensagem inicial
        await stepContext.context.sendActivity('1!');
        return stepContext.next();
    }

    async openticket(stepContext) {
        // implementar hasticket
        /*
        if (hasTicket()) {
            await stepContext.context.sendActivity(messagesPay.ticketOpen);
            await stepContext.context.sendActivity(messagesPay.chamado);
            if (ticketLate()) {
                await stepContext.context.sendActivity(messagesPay.ticketLate);
            } await stepContext.context.TextPrompt(messagesPay.ajudaSolicitacao, ['Sim'], ['Não']);
            // ler o prompt se sim ou não
            if (true) {
                await stepContext.context.sendActivity(messagesPay.resolverSolicitacao);
            } else{
                await stepContext.context.sendActivity(messagesPay.tudoBem);
            }
        } else {
            await stepContext.replaceDialog('2!');
        } */
        await stepContext.context.sendActivity('2!');
        return stepContext.next();
    }

    async changePayType(stepContext) {
        await stepContext.context.sendActivity('3!');
        return stepContext.next();
    }

    async changePayDate(stepContext) {
        await stepContext.context.sendActivity('4!');
        return stepContext.endDialog();
    }
}

module.exports.TrocaPagamento = TrocaPagamento;
