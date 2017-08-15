// import React from "react";
// import Realm from "realm";
//
// const DogSchema = {
//     name: 'Dog',
//     properties: {
//         name: 'string'
//     }
// };
// const CarSchema = {
//     name: 'Car',
//     properties: {
//         make: 'string',
//         model: 'string',
//         miles: {
//             type: 'int',
//             default: 0
//         }
//     }
// };
// const PersonSchema = {
//     name: 'Person',
//     properties: {
//         name: 'string',
//         birthday: 'date',
//         nickname: 'string',
//         picture: {
//             type: 'data',
//             optional: true
//         }, // optional property,
//     }
// };
//
// //进行初始化realm
// let realm = new Realm( {
//     schema: [ DogSchema, CarSchema, PersonSchema ]
// } );
//
// export function writeDog() {
//     realm.write( () => {
//         realm.create( 'Dog', { name: 'Rex' } );
//     } );
//
//     return {
//         'dos': realm.objects( 'Dog' )
//     }
// }
//
// export function writePerson() {
//     //进行写数据到表中 1.首先写入Car数据
//     realm.write( () => {
//         let person = realm.create( 'Person', {
//             name: '张三',
//             birthday: new Date( 1995, 11, 25 ),
//             nickname: '我是昵称',
//             // picture: 'http://www.lcode.org',
//         } );
//     } );
//
//     return {
//         'dos': realm.objects( 'Person' )
//     }
// }
