export const info = {
    definition:{
        openapi: '3.0.0',
        info:{
            title: 'Curso Backend 3',
            version: '1.0.0',
            description: 'Eleva Fit'
        },
        servers:[
            {
                url:'http://localhost:8080'
            }
        ]
    },
    apis: ['./src/docs/*.yml']
};