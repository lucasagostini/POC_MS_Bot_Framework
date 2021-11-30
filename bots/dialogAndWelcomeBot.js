// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { DialogBot } = require('./dialogBot');
const WelcomeCard = require('./resources/welcomecard.js');
const WELCOMED_USER = 'welcomedUserProperty';

class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.userState = userState;

        this.onMembersAdded(async (context, next) => {
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

            // Your bot should proactively send a welcome message to a personal chat the first time
            // (and only the first time) a user initiates a personal chat with your bot.
            if (!didBotWelcomedUser) {
                // The channel should send the user name in the 'From' object
                await context.sendActivity(WelcomeCard.messages.welcomeMessage);

                // Set the flag indicating the bot handled the user's first message.
                await this.welcomedUserProperty.set(context, true);
            } else {
                await context.sendActivity(WelcomeCard.messages.ola);
            }
            if (userAuth()) {
                // to do usuario autenticado
            } else {
                // to do usuario nao autenticado
            }
            await dialog.run(context, conversationState.createProperty('DialogState'));
            await next();
        });
    }
}
function userAuth(token) {
    // if (usuarios.includes('')) {
    // to do u
    // }
    return true;
}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
