export default {
  workOrderTicket: {
    podDelete: {
      tips: 'Approved tickets provide a 2-hours window for pod deletion, and the entire operation process will be fully recorded in the ticket.',
    },
    elasticScaling: {
      application: {
        tips: 'Application elastic scaling, conforms to the SRE specification.',
      },
      deployment: {
        tips: 'Specify Deployment to adjust the replica.',
      },
    },
    awsTransferSftp: {
      tips1: '1. Start with a letter, digit, or underscore',
      tips2: '2. Continue with 2-99 characters that can be letters, digits, underscores, @, periods, or hyphens',
      tips3: '3. Have a total length between 3-100 characters',
    },
  },
};
