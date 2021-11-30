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
            if (didBotWelcomedUser === false) {
                // The channel should send the user name in the 'From' object
                await context.sendActivity(WelcomeCard.messages.welcomeMessage);

                // Set the flag indicating the bot handled the user's first message.
                await this.welcomedUserProperty.set(context, true);
            } else {
                // to do se não for a primeira vez
            }
            const membersAdded = context.activity.membersAdded;
            for (const idx in membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    // await context.sendActivity(WelcomeCard.messages.welcomeMessage);
                    await dialog.run(context, conversationState.createProperty('DialogState'));
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
