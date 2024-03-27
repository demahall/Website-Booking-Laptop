document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');

    const name_input = document.getElementById('name');
    const hersteller_input = document.getElementById('hersteller');
    const service_tag_input = document.getElementById('service_tag');
    const user_password_input = document.getElementById('user_password');
    const dongle_id_input = document.getElementById('dongle_id');
    const vol_c_id_input = document.getElementById('vol_c_id');
    const mac_addresse_input = document.getElementById('mac_addresse');
    const puma_und_concerto_version_input = document.getElementById('puma_und_concerto_version');
    const puma_und_concerto_lizenz_datum_input = document.getElementById('puma_und_concerto_lizenz_datum');
    const lynx_version_input = document.getElementById('lynx_version');
    const lynx_lizenz_datum_input = document.getElementById('lynx_lizenz_datum');
    const cameo_version_input = document.getElementById('cameo_version');
    const cameo_lizenz_datum_input = document.getElementById('cameo_lizenz_datum');
    const creta_version_input = document.getElementById('creta_version');
    const creta_lizenz_datum_input = document.getElementById('creta_lizenz_datum');
    const gewaehrleistung_input = document.getElementById('gewaehrleistung');



    editButton.addEventListener('click', function () {

        name_input.removeAttribute('readonly');
        hersteller_input.removeAttribute('readonly');
        service_tag_input.removeAttribute('readonly');
        user_password_input.removeAttribute('readonly');
        dongle_id_input.removeAttribute('readonly');
        vol_c_id_input.removeAttribute('readonly');
        mac_addresse_input.removeAttribute('readonly');
        puma_und_concerto_version_input.removeAttribute('readonly');
        puma_und_concerto_lizenz_datum_input.removeAttribute('readonly');
        lynx_version_input.removeAttribute('readonly');
        lynx_lizenz_datum_input.removeAttribute('readonly');
        cameo_version_input.removeAttribute('readonly');
        cameo_lizenz_datum_input.removeAttribute('readonly');
        creta_version_input.removeAttribute('readonly');
        creta_lizenz_datum_input.removeAttribute('readonly');
        gewaehrleistung_input.removeAttribute('readonly');

        editButton.classList.add('d-none');
        saveButton.classList.remove('d-none');
    });

    saveButton.addEventListener('click', function () {
        // Perform validation and submit the form
        document.getElementById('laptopForm').submit();
    });
});