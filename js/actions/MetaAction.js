/**
 * Created by xiaoconglau on 11/04/2017.
 */
import metaActionTypes from "../reducers/meta/metaActionTypes";
import { netMetaGetAllAreas, netMetaGetCategory, netMetaGetCategoryDetail } from "../net/MetaNet";

export function metaGetCategory( parentId, callback ) {
    return ( dispatch ) => {
        netMetaGetCategory( parentId, ( err, resBody ) => {
            if ( !err && parentId === -1 ) {
                dispatch( { 'type': metaActionTypes.META_CATEGORY_UPDATE, categoryList: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function metaGetCategoryDetail( cid, callback ) {
    return ( dispatch ) => {
        netMetaGetCategoryDetail( cid, ( err, resBody ) => {
            callback && callback( err, resBody );
        } )
    };
}


export function metaGetAllAreas( callback ) {
    return ( dispatch ) => {
        netMetaGetAllAreas( ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': metaActionTypes.META_ALL_AREAS_UPDATE, areaList: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}