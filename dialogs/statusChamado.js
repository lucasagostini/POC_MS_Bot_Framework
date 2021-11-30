// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');

const WATERFALL_DIALOG = 'waterfallDialog';

class StatusChamado extends ComponentDialog {
    constructor(id) {
        super(id || 'statusChamado');
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async initialStep(stepContext) {
        await stepContext.sendActivity('Fluxo ainda não implementado!');
        return await stepContext.endDialog();
    }
}

module.exports.StatusChamado = StatusChamado;
