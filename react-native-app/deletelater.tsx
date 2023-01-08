const scanAndConnect = () => {
    const data = Uint8Array.from([1]);

    bleManager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning...");
      console.log(device);

      if (error) {
        console.log("Error while scanning :", error);
        return;
      }

      if (device && device.name?.includes("B2-GreenDMS")) {
        console.log("Connecting to hm-10");
        bleManager.stopDeviceScan();

        device
          .connect()
          .then((device) => {
            console.log("Discovering services and characteristics");
            // console.log("device info" , device.discoverAllServicesAndCharacteristics);
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            const deviceInfo = device.characteristicsForService;
            console.log("DEVICE INFO: ", deviceInfo);
            device
              .writeCharacteristicWithResponseForService(
                `${device.id}`,
                "1111",
                "MQ=="
              )
              .then((characteristic) => {
                console.log("CHARACTERISTICS VALUE", characteristic.value);
                return;
              });
          })
          .catch((error) => {
            console.log("ERROR IN CONNECT", error.message);
          });
      }
    });