// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
// const { UserState } = require('botbuilder-core');
const { ComponentDialog, WaterfallDialog, ConfirmPrompt, NumberPrompt } = require('botbuilder-dialogs');
// const { isEntity } = require('botframework-schema');
// const { DateResolverDialog } = require('./dateResolverDialog');
const { cpf, cnpj } = require('cpf-cnpj-validator');
const messagesAuth = require('../bots/resources/fluxoInicial.js');
const { listaUsuarios } = require('./mainDialog.js');

const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_AUTH = 'authUser';

let index = null;

class AuthUser extends ComponentDialog {
    constructor(id) {
        super(id || USER_AUTH);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.cpfCNPJvalidator));
        this.addDialog(new WaterfallDialog(USER_AUTH, [
            this.initialStep.bind(this),
            this.secondStep.bind(this),
            this.middleStep.bind(this),
            this.afterMiddleStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = USER_AUTH;
    }

    async initialStep(stepContext) {
        await stepContext.context.sendActivity(messagesAuth.messagesInicial.informaDoc);
        return stepContext.prompt(NUMBER_PROMPT);
    }

    async secondStep(stepContext) {
        index = searchAuth(stepContext.result);
        if (index) {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.encontrei);
            // ir pros intents
            // return stepContext.replaceDialog();
        } else {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.naoEncontrei);
            return stepContext.prompt(CONFIRM_PROMPT, messagesAuth.messagesInicial.jaCliente, ['Sim', 'Não']);
        }
    }

    async middleStep(stepContext) {
        if (stepContext.result) {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.informaDocNovamente);
            return stepContext.prompt(NUMBER_PROMPT);
        } else {
            return stepContext.prompt(CONFIRM_PROMPT, messagesAuth.messagesInicial.querParceiro, ['Sim', 'Não']);
        }
    }

    async afterMiddleStep(stepContext) {
        if (typeof stepContext.result === 'number') {
            index = searchAuth(stepContext.result);
            return stepContext.next();
        }
        if (typeof stepContext.result === 'boolean') {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.queNoticiaBoa);
        } else {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.quePena);
        }
        return stepContext.endDialog();
    }

    async finalStep(stepContext) {
        if (index) {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.encontrei);
            // ir pros intents
            // return stepContext.replaceDialog();
        } else {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.naoEncontreiFinal);
            return stepContext.endDialog();
        }
    }

    async cpfCNPJvalidator(stepContext) {
        if (cnpj.isValid(stepContext.result) | cpf.isValid(stepContext.result)) {
            return true;
        }
        return false;
    }
}

function searchAuth(documento) {
    for (let i = 0; i < listaUsuarios.lenght; i++) {
        if (listaUsuarios[i].document === documento) {
            return i;
        }
    }
    return false;
}
module.exports = {
    AuthUser,
    searchAuth,
    index
};
