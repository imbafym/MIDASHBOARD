// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
    // Guy's firebase DB
    firebase: {
        apiKey: 'AIzaSyBS6gHkzduvwl10H9-JF67Hk3g7QqoAIag',
        authDomain: 'midash-57f32.firebaseapp.com',
        databaseURL: 'https://midash-57f32.firebaseio.com/',
        projectId: 'midash-57f32',
        storageBucket: 'midash-57f32.appspot.com',
        messagingSenderId: '794657753308'
    },
    // frank's firebase DB
    firebase1: {
        apiKey: 'AIzaSyBNs0jC1Jj3QMBF5CZmBWX2fOPK4dzztnw',
        authDomain: 'mipos-online-report-system.firebaseapp.com',
        databaseURL: 'https://mipos-online-report-system.firebaseio.com',
        projectId: 'mipos-online-report-system',
        storageBucket: 'mipos-online-report-system.appspot.com',
        messagingSenderId: '1069577088184'
    }
};
