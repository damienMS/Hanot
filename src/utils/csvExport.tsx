import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

/**
 * ask permission to write a file for different platform
 */
const platformPermission = () => {
  try {
    switch (Platform.OS) {
      case 'ios':
        return request(PERMISSIONS.IOS.MEDIA_LIBRARY);
      case 'android':
        return request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

      default:
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param fn function to execute
 */
export const requestWritePermission = async (fn: () => any) => {
  try {
    const permission = await platformPermission();
    switch (permission) {
      case RESULTS.GRANTED:
        console.log('You have permision to write to the file system');
        fn();
        break;

      case RESULTS.DENIED:
        break;

      default:
        break;
    }
  } catch (error) {
    console.warn(error);
  }
};

/**
 *
 * @returns path where the path will be writen
 */
const platformWritePath = () => {
  switch (Platform.OS) {
    case 'android':
      return '/storage/emulated/0/Download/';
    case 'ios':
      return '/storage/emulated/0/Download/';
    case 'windows':
      break;
    default:
      break;
  }
};

/**
 * export a csv file
 * @param file
 * @param nameFile
 */
export const csvExport = (file: string[][], nameFile: string) => {
  // const values = [
  //   [{hex: '000', letter: 'A'}, {hex: '000', letter: 'A'}],
  //   ['deploy', '2017-11-05T05:42:04.810Z'],
  //   ['jai envie', 'de pas manger ça voila'],
  // ];

  // construct csvString
  const headerString = 'event,timestamp\n';
  let rowString = '';
  if (file.length > 0) {
    rowString = file.map(d => `${d[0]},${d[1]}\n`).join('');
  }

  const csvString = `${headerString}${rowString}`;

  // write the current list of answers to a local csv file
  //const doc_path = await pickDirect();

  const platformPath = platformWritePath();
  const pathToWrite = `${platformPath}${nameFile}`;
  console.log('pathToWrite', pathToWrite);
  // pathToWrite /storage/emulated/0/Download/data.csv
  RNFS.writeFile(pathToWrite, csvString, 'utf8')
    .then(() => {
      console.log(`wrote file ${pathToWrite}`);
      // wrote file /storage/emulated/0/Download/data.csv
    })
    .catch((err: any) => {
      console.error(err);
    });
};
