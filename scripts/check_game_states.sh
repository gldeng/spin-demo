export IP=127.0.0.1
export ENDPOINT=http://${IP}:8000
export WALLET_ADDRESS=W1ptWN5n5mfdVvh3khTRm9KMJCAUdge9txNyVtyvZaYRYcqc1
export WALLET_PASSWORD=admin123
export GAME_CONTRACT_ADDRESS="V3ejNRkkbERXkStPNBmXRtkdtuDvKPrZ1ha6hpUq9PkXCBCRY"

aelf-command call $GAME_CONTRACT_ADDRESS -a $WALLET_ADDRESS -p $WALLET_PASSWORD -e $ENDPOINT GetGameState
