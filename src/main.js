// src/main.js
// import foo from './foo.js';

const a = 1
export default () =>{
    console.log('the a is ' + a());
    import('./foo.js').then(({ default: foo }) => console.log(foo));
}