export default [
    accessForbidden
];

function accessForbidden( err, res ) {
    return res && res.status === 403;
}