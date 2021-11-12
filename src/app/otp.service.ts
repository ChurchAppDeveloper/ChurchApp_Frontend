import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private phNumber_ = new BehaviorSubject('');
  public phNumber = this.phNumber_.asObservable();

  private cognitoUser: CognitoUser & { challengeParam: { sms: string } };

  setphNumber(equipmentId: string) {
    this.phNumber_.next(equipmentId);
  }


  // Get access to window object in the Angular way
  private window: Window;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;
  }

  public async signIn(sms: string) {
    this.cognitoUser = await Auth.signIn(sms);
  }

  public async signOut() {
    await Auth.signOut();
  }

  public async answerCustomChallenge(answer: string) {
    this.cognitoUser = await Auth.sendCustomChallengeAnswer(this.cognitoUser, answer);
    return this.isAuthenticated();
  }

  public async getPublicChallengeParameters() {
    return this.cognitoUser.challengeParam;
  }

  public async signUp(sms: string, fullName: string) {
    const params = {
      username: sms,
      password: this.getRandomString(30),
      attributes: {
        name: fullName
      }
    };
    await Auth.signUp(params);
  }

  private getRandomString(bytes: number) {
    const randomValues = new Uint8Array(bytes);
    this.window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(this.intToHex).join('');
  }

  private intToHex(nr: number) {
    return nr.toString(16).padStart(2, '0');
  }

  public async isAuthenticated() {
    try {
      await Auth.currentSession();
      return true;
    } catch {
      return false;
    }
  }

  public async getUserDetails() {
    if (!this.cognitoUser) {
      this.cognitoUser = await Auth.currentAuthenticatedUser();
    }
    return await Auth.userAttributes(this.cognitoUser);
  }

}
