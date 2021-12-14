const { DialogBot } = require('./dialogBot');
const WELCOMED_USER = 'welcomedUserProperty';

class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.onMembersAdded(async (context, next) => {
            await dialog.run(context, conversationState.createProperty('DialogState'));
            await next();
        });
    }
}

module.exports = {
    DialogAndWelcomeBot
};
