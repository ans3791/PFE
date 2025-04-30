import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLogged = false;
  user: User | null;

  constructor() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
      this.isLogged = true;
    }
  }

  logUser(user: User) {
    this.user = user;
    this.isLogged = true;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logoutUser() {
    this.user = null;
    this.isLogged = false;
    localStorage.removeItem('user');
  }
}
