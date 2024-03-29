import { Component, ViewChild, OnInit } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import {uniqBy} from 'lodash'

import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProgressbarService } from '../services/progressbar/progressbar.service'

export interface ID {
  storedAppID: string;
}

@Component({
  selector: 'app-apple-id-chips',
  templateUrl: './apple-id-chips.component.html',
  styleUrls: ['./apple-id-chips.component.scss']
})
export class AppleIdChipsComponent implements OnInit {

  value = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  iOSServerUrl = 'https://api.zaibatsu.fyi/api/ios';

  @ViewChild("chipList") chipList;


  ids: ID[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add an ID
    if ((value || '').trim()) {
      this.ids.push({storedAppID: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(id: ID): void {
    const index = this.ids.indexOf(id);

    if (index >= 0) {
      this.ids.splice(index, 1);
    }
  }

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private progressbarService: ProgressbarService
    ) {}





  sendIOSRequest() {
    var ids = this.ids

    console.log('initial ids: ', ids)

    var uniqIds = uniqBy(ids, (id) => id.storedAppID)

    console.log('unique ids: ', uniqIds)

    const properIDs = uniqIds.filter((id) => 
      id.storedAppID.includes('apps.apple.com')
    )

    console.log('Proper IDs: ', properIDs)


    if (uniqIds.length > properIDs.length) {
      this.chipList.errorState = true;
      setTimeout(()=> {
        this.chipList.errorState = false;
      }, 5000)
    }

    if (!properIDs.length) {
      console.log('No valid URLs added')
    } else {

      // debugger;
      this.http.post<ID>(this.iOSServerUrl, properIDs, { withCredentials: true })
        .pipe(
          catchError(error => {
            console.log('Sending data failed')
            return throwError(error)
          })
        ).subscribe(properIDs => console.log(properIDs))

        // ids.splice(index, 1)
        
        this.openSnackBar()
        this.callProgressBar()
        ids.splice(0,ids.length)

    }
  }

  openSnackBar() {
    this._snackBar.open('Zaibatsu bot is fetching data, it will appear in the table below. Normally it takes from 8 to 30 seconds for each app update', 'Got it', {
      duration: 10000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  callProgressBar(){
    this.progressbarService.sendClickEvent(this.ids.length);
    }


  ngOnInit(): void {
  }

}

