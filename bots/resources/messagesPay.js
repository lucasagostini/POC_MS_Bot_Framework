const messagesFluxo = {
    ticketAberto: 'Vi aqui que você já tem um chamado aberto para alterar a forma ou o prazo de pagamento dos seus pedidos:    ',
    chamado: 'Número de protocolo do chamado :', // ${ listaUsuarios[index].ticketNumber } \n   ${ listaUsuarios[index].ticketType } \n    ${ listaUsuarios[index].ticketStat } \n    ${ listaUsuarios[index].ticketData } \n  ${ listaUsuarios[index].ticketRes }`,
    tipo: 'Tipo do chamado: ',
    status: ' Status: ',
    criadoEm: ' Criado em: ',
    resolu: ' Resolução prevista para: ',
    atrasado: 'O prazo pra analisar seu chamado está um pouco maior que o normal, mas nosso time está se esforçando pra te dar um retorno logo 😉',
    ajudaSolicitacao: 'Você precisa de ajuda com essa solicitação em andamento?',
    resolverSolicitacao: `Pra resolver isso, você pode contar com a ajuda da nossa equipe no app do Parceiro Ambev 👉 http://onelink.to/4u2bf4 ou no 📞 0800 887 1111.
    Se eu puder ajudar com outras solicitações é só mandar uma mensagem por aqui! 👋`,
    tudoBem: 'Tudo bem! 😃',
    formaInformada: 'Entendi que você quer alterar a forma de pagamento dos seus pedidos para ',
    formaNaoInformada: 'Como você quer pagar seus pedidos: boleto, cheque ou dinheiro?    ',
    naoCartao: 'Ainda não aceitamos pagamento com cartão 😕 ',
    formasValidas: `Você pode pagar seus pedidos com:  
    1 - Boleto     
    2 - Cheque     
    3 - Dinheiro   
    Qual dessas formas de pagamento você prefere?`,
    naoNaoCartao: 'Realmente não consigo alterar a forma de pagamento dos seus pedidos para a opção desejada 😕    ',
    qualPrazo: 'Qual é o prazo de pagamento desejado? 🤔    ',
    abrindoChamado: 'Já estou abrindo um chamado para que o nosso time financeiro avalie sua solicitação 😉 ',
    prazoInvalido: 'Você pode pedir até 7 dias para pagar seus pedidos. Por favor, me informe o prazo desejado.    ',
    prazoImpossivel: 'Esse realmente não é um prazo possível 😕',
    naoAbriuChamado: 'Desculpe, houve um problema ao abrir seu chamado. Tente novamente mais tarde!',
    abriuChamado: `Pronto, aqui está o número do seu chamado:  
    O prazo para que a gente avalie sua solicitação é de até 2 dias úteis.`,
    okMas: `Ok, podemos resolver isso 👍 
    Mas antes preciso confirmar uma informação: `
};
module.exports.messagesFluxo = messagesFluxo;
