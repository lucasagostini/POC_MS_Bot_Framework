class UserService {
    constructor() {
        this.listaUsuarios = [
            new User(
                '12345678901',
                20211207,
                1,
                'Alteração de Dados',
                'Em Andamento',
                20211209),
            new User(
                '12345678902',
                20211205,
                2,
                'Alteração de Dados',
                'Em Andamento',
                20211207
            ),
            new User(
                '12345678903'
            )
        ];
    }

    getUser(document) {
        for (let i = 0; i < this.listaUsuarios.length; i++) {
            if (this.listaUsuarios[i].documento === document.toString()) {
                return this.listaUsuarios[i];
            }
        }
        return null;
    }

    addTicket(usuario) {
        usuario.ticketData = 20211209;
        usuario.ticketNumber = 12;
        usuario.ticketRes = 20211211;
        usuario.ticketStat = 'Aberto';
        usuario.ticketType = 'Chamado';
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
