const { ComponentDialog, WaterfallDialog, ConfirmPrompt, NumberPrompt } = require('botbuilder-dialogs');
const messagesAuth = require('../bots/resources/fluxoInicial.js');
const { UserService } = require('../services/userService.js');
const { cpf, cnpj } = require('cpf-cnpj-validator');

const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_AUTH = 'authUser';

class AuthUser extends ComponentDialog {
    constructor(id, userState, luisRecognizer) {
        super(id || USER_AUTH);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT), this.documentValidator);
        this.addDialog(new WaterfallDialog(USER_AUTH, [
            this.initialStep.bind(this),
            this.secondStep.bind(this),
            this.middleStep.bind(this),
            this.afterMiddleStep.bind(this)
        ]));
        this.userState = userState;
        this.luisRecognizer = luisRecognizer;
        this.userService = new UserService();
        this.initialDialogId = USER_AUTH;
    }

    async initialStep(stepContext) {
        return stepContext.prompt(NUMBER_PROMPT, messagesAuth.messagesInicial.informaDoc);
    }

    async secondStep(stepContext) {
        const usuario = this.userService.getUser(stepContext.result);
        this.usuario = this.userState.createProperty('usuario');
        if (usuario) {
            await this.usuario.set(stepContext.context, this.userService.getUser(stepContext.result));
            await this.userState.saveChanges(stepContext.context);
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.encontrei);
            return stepContext.endDialog();
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
            const usuario = this.userService.getUser(stepContext.result);
            this.usuario = this.userState.createProperty('usuario');
            if (usuario) {
                await this.usuario.set(stepContext.context, this.userService.getUser(stepContext.result));
                await this.userState.saveChanges(stepContext.context);
                await stepContext.context.sendActivity(messagesAuth.messagesInicial.encontrei);
                return stepContext.endDialog();
            } else {
                await stepContext.context.sendActivity(messagesAuth.messagesInicial.naoEncontreiFinal);
                return stepContext.cancelAllDialogs({ cancelParents: true });
            }
        }
        if (typeof stepContext.result === 'boolean') {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.queNoticiaBoa);
        } else {
            await stepContext.context.sendActivity(messagesAuth.messagesInicial.quePena);
        }
        return stepContext.cancelAllDialogs({ cancelParents: true });
    }

    async documentValidator() {
        if (cpf.isValid(document) || cnpj.isValid(document)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = {
    AuthUser
};
