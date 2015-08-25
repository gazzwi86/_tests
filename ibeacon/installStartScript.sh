chmod 777 startBeacon
chmod 777 stopBeacon

cp ibeacon /etc/init.d/ibeacon

chmod 777 /etc/init.d/ibeacon
update-rc.d ibeacon defaults