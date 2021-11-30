// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const WATERFALL_DIALOG = 'waterfallDialog';

class StatusChamado extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'statusChamado');
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async initialStep(stepContext) {
        await context.sendActivity('Fluxo ainda não implementado!');
        return await stepContext.endDialog();
    }
}

module.exports.DateResolverDialog = StatusChamado;
