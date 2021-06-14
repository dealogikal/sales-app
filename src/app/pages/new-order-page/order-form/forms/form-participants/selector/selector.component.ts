import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, skipWhile, startWith, switchMap, take } from 'rxjs/operators';
import { FormService } from 'src/app/services/form.service';
import { NewOrderService } from 'src/app/services/new-order.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'selector',
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.scss']
})
export class ParticipantsSelectorComponent implements OnInit {

    formGroup: FormGroup;

    $participants!: Subscription;
    participants$!: Observable<any>;
    filteredParticipants$!: Observable<any>;
    parsedParticipants$!: Observable<any>;
    selectedParticipants$: BehaviorSubject<any> =  new BehaviorSubject([]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private formBloc: FormService,
        private users: UsersService,
        private order: NewOrderService,
    ) {
        this.formGroup = this.formBuilder.group({
            filter: ['']
        });
    }

    ngOnInit() {

        this.formBloc.get().pipe(take(1)).subscribe(formProduct => {
            // console.log('participants init value', formProduct.participants);
            this.selectedParticipants$.next(formProduct.participants.reduce((acc: any, curr: any) => {
                if (acc.findIndex((p: any) => p.label == curr.groupName) == -1) {
                    acc.push({
                        label: curr.groupName,
                        selected: curr.selected
                    });
                }
                return acc;
            }, []));
        });


        this.$participants = combineLatest(
            this.order.get().pipe(skipWhile(order => !order.commodity)),
            this.formBloc.get().pipe(take(1)),
        ).subscribe(([order, formProduct]) => {
            console.log('reload???');
            this.participants$ = this.users.getSellers().pipe(
                filter(users => !!users),
                map((sellers) => {
                    // console.log('sellers', sellers);
                    const requirements = ['SEC Registration', 'BIR Registration', 'Business Permit'];
                    return sellers.map((user: any) => {
                        const isNotVerified = requirements.some(req => {
                            const doc = user.registration.docs.find((d: any) => d.name == req);
                            if (!doc) return true;
                            return !doc.verified;
                        });

                        return {
                            id: user._id,
                            email: user.emails[0].address,
                            groupName: user.groupName,
                            companyName: user.registration.businessProfile.companyName,
                            mobileNo: {
                                countryCode: user.info.mobileNo.countryCode,
                                number: user.info.mobileNo.number
                            },
                            verified: !isNotVerified
                        }
                    });
                })
            );

            this.parsedParticipants$ = combineLatest(
                this.participants$,
                this.selectedParticipants$
            ).pipe(
                map(([participants, selectedParticipants]) => {
                    return participants.reduce((acc: any, curr: any) => {
                        if (acc.findIndex((p: any) => p.label == curr.groupName) == -1) {
                            acc.push({
                                label: curr.groupName,
                                verified: curr.verified,
                                selected: selectedParticipants.some((selected: any) => selected.label == curr.groupName),
                            });
                        }
                        return acc;
                    }, []);
                })
            );

            this.filteredParticipants$ = combineLatest(
                this.parsedParticipants$,
                this.formGroup.get('filter')!.valueChanges.pipe(startWith(''))
            ).pipe(
                map(([participants, filter]) => {
                    // console.log('filter >>>', filter);
                    // console.log('form filter >>>', this.formGroup.value.filter);

                    if (!filter || filter == '') {
                        return participants.sort((a: any, b: any) => {
                            return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
                        }).sort((a: any, b: any) => (a.verified === b.verified) ? 0 : a.verified ? -1 : 1);
                    }
                    return participants.filter((participant: any) => participant.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1).sort((a: any, b: any) => {
                        return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
                    }).sort((a: any, b: any) => (a.verified === b.verified) ? 0 : a.verified ? -1 : 1);
                })
            );


        });


    }

    ngOnDestroy() {
        if (this.$participants) {
            this.$participants.unsubscribe();
        }
    }

    onSelectAll() {

        combineLatest(
            this.parsedParticipants$,
            this.participants$,
        ).pipe(take(1)).subscribe(([parsedParticipants, participants]) => {
            const selectedParticipants = parsedParticipants.map((p: any) => {
                p.selected = true;
                return p;
            })
            this.selectedParticipants$.next(selectedParticipants);

            this.formBloc.set({
                participants: selectedParticipants.reduce((acc: any, curr: any) => {
                    const p = participants.filter((participant: any) => participant.groupName == curr.label).map((participant: any) => {
                        delete participant.selected;
                        delete participant.verified;
                        return participant;
                    })

                    p.forEach((participant: any) => {
                        acc.push(participant);
                    });

                    return acc;
                }, [])
            });
        })
    }

    onToggle(participant: any) {
        combineLatest(
            this.selectedParticipants$,
            this.participants$,
        ).pipe(take(1)).subscribe(([selectedParticipants, participants]) => {
            // console.log('ontoggle');
            const selectedIndex = selectedParticipants.findIndex((selectedParticipant: any) => {
                return selectedParticipant.label == participant.label;
            });

            if (selectedIndex >= 0) selectedParticipants.splice(selectedIndex, 1);
            if (selectedIndex == -1) selectedParticipants.push(participant);

            this.selectedParticipants$.next(selectedParticipants);

            this.formBloc.set({
                participants: selectedParticipants.reduce((acc: any, curr: any) => {
                    const p = participants.filter((participant: any) => participant.groupName == curr.label).map((participant: any) => {
                        delete participant.selected;
                        delete participant.verified;
                        return participant;
                    })

                    p.forEach((participant: any) => {
                        acc.push(participant);
                    });

                    return acc;
                }, [])
            });
        });
    }

    onClose() {
        var start_idx = this.router.url.indexOf('/select');
        var url = this.router.url.substring(0, start_idx);
        this.router.navigate([url]);
    }








}