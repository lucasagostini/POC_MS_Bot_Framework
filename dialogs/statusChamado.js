// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');

const STATUS_CHAMADO = 'statusChamado';
class StatusChamado extends ComponentDialog {
    constructor(id) {
        super(id || STATUS_CHAMADO);
        this.addDialog(new WaterfallDialog(STATUS_CHAMADO, [
            this.initialStep.bind(this)
        ]));

        this.initialDialogId = STATUS_CHAMADO;
    }

    async initialStep(stepContext) {
        await stepContext.context.sendActivity('Fluxo ainda não implementado!');
        return stepContext.endDialog();
    }
}

module.exports.StatusChamado = StatusChamado;
