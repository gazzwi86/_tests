echo "installing dependencies"
apt-get install libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev

echo "downloading bluez 5.8"
wget www.kernel.org/pub/linux/bluetooth/bluez-5.8.tar.xz

echo "unpacking bluez 5.8"
unxz bluez-5.8.tar.xz
tar xvf bluez-5.8.tar

echo "building bluez 5.8"
cd bluez-5.8

./configure -disable-systemd
make
make install

echo "done, now run configurebeacon.sh and startAdvertising.sh"