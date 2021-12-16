class UserService {
    constructor() {
        this.listaUsuarios = [
            new User(
                '05172654003',
                20211107,
                1,
                'Alteração de Dados',
                'Em Andamento',
                20211109),
            new User(
                '25405268020',
                20211105,
                2,
                'Alteração de Dados',
                'Em Andamento',
                20211107
            ),
            new User(
                '07372340403'
            )
        ];
    }

    getUser(document) {
        // for removido, find usado
        const elemento = this.listaUsuarios.find(elem => {
            return elem.documento === document.toString();
        });
        return elemento;
    }
}

class User {
    constructor(documento, ticketData, ticketNumber, ticketType, ticketStat, ticketRes) {
        this.documento = documento;
        this.ticketData = ticketData;
        this.ticketNumber = ticketNumber;
        this.ticketType = ticketType;
        this.ticketStat = ticketStat;
        this.ticketRes = ticketRes;
    }
}
module.exports = {
    UserService
};
