import { Injectable } from '@angular/core';
import { User } from '../app/common/class/user';
import { Observable, of } from 'rxjs';
import { RestRequestService } from './rest-request.service';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class EmployerLogService {

  private utenteLoggato : User;

  constructor(private httpService : RestRequestService, private router: Router) {}
  

  isLogged() : boolean{
    return this.utenteLoggato ? true : false;
  }

  logIn(username: String, password: String){
    if((!this.utenteLoggato || !this.utenteLoggato.token)){
      this.httpService.login(username, password).subscribe(function(response){
        this.caricaUtenteLoggato(response);
        this.router.navigate(['/dashboard']);
      }.bind(this));
    }
  }

  refreshSessionByTokenRequest(){
    if(sessionStorage.getItem("token")){
      return this.httpService.validateToken(sessionStorage.getItem("token"));
    }
    return null;
  }

  logOut() : boolean{
    delete this.utenteLoggato;
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    return;
    //TODO: Inserire il metodo del service rest-request che effettua il logout
  }

  caricaUtenteLoggato(response : any){
    if(!response['success']){
      return false;
    }
    this.utenteLoggato = new User();
    this.utenteLoggato.token = response['data'].token;
    sessionStorage.setItem("token", response['data'].token);
    this.utenteLoggato.nome = response['data'].nome;
    this.utenteLoggato.cognome = response['data'].cognome;
    this.utenteLoggato.ruolo = response['data'].ruolo;
    console.log(response['data'].token);
    return true;
  }

  isManager() : boolean{
    return this.utenteLoggato.ruolo == 'manager';
  }
  
  getNomeUtente() : String {
    return this.utenteLoggato.nome;
  }
  getCognomeUtente() : String {
    return this.utenteLoggato.cognome;
  }
}
