import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService, Dialog, GetCollectionListQuery, ItemOf } from '@vendure/admin-ui/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'vdr-move-collections-dialog',
    templateUrl: './move-collections-dialog.component.html',
    styleUrls: ['./move-collections-dialog.component.scss', '../collection-list/collection-list-common.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveCollectionsDialogComponent
    implements OnInit, Dialog<ItemOf<GetCollectionListQuery, 'collections'>>
{
    resolveWith: (result?: ItemOf<GetCollectionListQuery, 'collections'>) => void;
    searchTermControl = new FormControl('');
    items$: Observable<Array<ItemOf<GetCollectionListQuery, 'collections'>>>;
    totalItems$: Observable<number>;
    currentPage$ = new BehaviorSubject(1);
    itemsPerPage$ = new BehaviorSubject(10);
    expandedIds$ = new Subject<string[]>();
    expandedIds: string[] = [];
    subCollections$: Observable<Array<ItemOf<GetCollectionListQuery, 'collections'>>>;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const getCollectionsResult = this.dataService.collection.getCollections();

        const searchTerm$ = this.searchTermControl.valueChanges.pipe(
            debounceTime(250),
            distinctUntilChanged(),
            startWith(''),
        );
        const currentPage$ = this.currentPage$.pipe(distinctUntilChanged());
        const itemsPerPage$ = this.itemsPerPage$.pipe(distinctUntilChanged());
        combineLatest(searchTerm$, currentPage$, itemsPerPage$).subscribe(
            ([searchTerm, currentPage, itemsPerPage]) => {
                const topLevelOnly = searchTerm === '';
                getCollectionsResult.ref.refetch({
                    options: {
                        skip: (currentPage - 1) * itemsPerPage,
                        take: itemsPerPage,
                        filter: {
                            name: { contains: searchTerm },
                        },
                        topLevelOnly,
                    },
                });
            },
        );

        this.items$ = getCollectionsResult.mapStream(data => data.collections.items);
        this.totalItems$ = getCollectionsResult.mapStream(data => data.collections.totalItems);

        this.subCollections$ = this.expandedIds$.pipe(
            tap(val => (this.expandedIds = val)),
            switchMap(ids => {
                if (ids.length) {
                    return this.dataService.collection
                        .getCollections({
                            take: 999,
                            filter: {
                                parentId: { in: ids },
                            },
                        })
                        .mapStream(data => data.collections.items);
                } else {
                    return of([]);
                }
            }),
        );
    }

    toggleExpanded(collection: ItemOf<GetCollectionListQuery, 'collections'>) {
        let expandedIds = this.expandedIds;
        if (!expandedIds.includes(collection.id)) {
            expandedIds.push(collection.id);
        } else {
            expandedIds = expandedIds.filter(id => id !== collection.id);
        }
        this.expandedIds$.next(expandedIds);
    }
}
