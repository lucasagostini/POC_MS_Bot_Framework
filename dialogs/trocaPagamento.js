// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { ConfirmPrompt, ComponentDialog, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { DateResolverDialog } = require('./dateResolverDialog');

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
                this.latesolution(this)
            ]));

        this.initialDialogId = TROCA_PAGAMENTO;
    }

    async initialStep(stepContext) {
        await stepContext.context.sendActivity('1!');
        return stepContext.context.next();
    }

    async openticket(stepContext) {
        // await stepContext.context.sendActivity('2!');
        // return stepContext.context.next();
    }

    async latesolution(stepContext) {
        // await stepContext.context.sendActivity('3!');
        // return stepContext.context.endDialog();
    }
}

module.exports.TrocaPagamento = TrocaPagamento;
