import { Guid } from 'guid-typescript';

export interface StudentFormViewModel {
    id: string;
    gender: string;
    name: string;
    birthDate: Date;
    adress: string;
    phone: string;
    emailAddress: string;
    photo: string;
    classId: string;
    class: string;
}
export interface ClassViewModel {
    id: string;
    name: string;
}
export class StudentEditor implements StudentEditor
{

    public id: string='';
    public gender: string='';
    public name: string='';
    public birthDate: Date=new Date();
    public adress: string='';
    public phone: string='';
    public emailAddress: string='';
    public photo: string='';
    public classId: string='';
    public class: string;
    public classList:ClassViewModel[]=[{ id:'11', name:"A"},{ id:'22', name:"B"}]

 constructor()
 {
     this.id = Guid.create().toString();
 }
 
}