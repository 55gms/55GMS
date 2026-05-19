function decodeObfuscatedString(encoded, key) {
  const base64Chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';

  function decodeBase64(base64String) {
    let decoded = '';
    let char1, char2, char3, char4;
    let i = 0;

    while (i < base64String.length) {
      char1 = base64Chars.indexOf(base64String.charAt(i++));
      char2 = base64Chars.indexOf(base64String.charAt(i++));
      char3 = base64Chars.indexOf(base64String.charAt(i++));
      char4 = base64Chars.indexOf(base64String.charAt(i++));

      char1 = (char1 << 2) | (char2 >> 4);
      char2 = ((char2 & 15) << 4) | (char3 >> 2);
      char3 = ((char3 & 3) << 6) | char4;

      decoded += String.fromCharCode(char1);

      if (char3 !== 64) {
        decoded += String.fromCharCode(char2);
      }
      if (char4 !== 64) {
        decoded += String.fromCharCode(char3);
      }
    }

    let escaped = '';
    for (let j = 0; j < decoded.length; j++) {
      escaped += '%' + ('00' + decoded.charCodeAt(j).toString(16)).slice(-2);
    }
    return decodeURIComponent(escaped);
  }


  function decrypt(encrypted, secret) {
    let output = [];
    let i = 0;
    let j = 0;
    encrypted = decodeBase64(encrypted);
    for (let k = 0; k < 256; k++) {
      output[k] = k;
    }
    for (let k = 0; k < 256; k++) {
      j = (j + output[k] + secret.charCodeAt(k % secret.length)) % 256;
      let temp = output[k];
      output[k] = output[j];
      output[j] = temp;
    }
    i = 0;
    j = 0;
    let decrypted = '';
    for (let k = 0; k < encrypted.length; k++) {
      i = (i + 1) % 256;
      j = (j + output[i]) % 256;
      let temp = output[i];
      output[i] = output[j];
      output[j] = temp;
      decrypted += String.fromCharCode(encrypted.charCodeAt(k) ^ output[(output[i] + output[j]) % 256]);
    }
    return decrypted;
  }

  return decrypt(encoded, key);
}


var version_ = 'jsjiami.com.v7';
var decodeObfuscatedString = _0x2ccf;
function _0x2ccf(_0x5ede4c, _0x421cd0) {
  var _0x201b94 = _0x201b();
  return _0x2ccf = function (_0x2ccfbc, _0x1997bc) {
    _0x2ccfbc = _0x2ccfbc - 0x135;
    var _0x5a6004 = _0x201b94[_0x2ccfbc];
    if (_0x2ccf['mCKyUd'] === undefined) {
      var _0x1b8c1f = function (_0x5592cb) {
        var _0x289600 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
        var _0x21bc67 = ''
          , _0x1677a4 = '';
        for (var _0x2c25d4 = 0x0, _0x127d4f, _0x161e16, _0x5b3165 = 0x0; _0x161e16 = _0x5592cb['charAt'](_0x5b3165++); ~_0x161e16 && (_0x127d4f = _0x2c25d4 % 0x4 ? _0x127d4f * 0x40 + _0x161e16 : _0x161e16,
          _0x2c25d4++ % 0x4) ? _0x21bc67 += String['fromCharCode'](0xff & _0x127d4f >> (-0x2 * _0x2c25d4 & 0x6)) : 0x0) {
          _0x161e16 = _0x289600['indexOf'](_0x161e16);
        }
        for (var _0x9bf077 = 0x0, _0x166df7 = _0x21bc67['length']; _0x9bf077 < _0x166df7; _0x9bf077++) {
          _0x1677a4 += '%' + ('00' + _0x21bc67['charCodeAt'](_0x9bf077)['toString'](0x10))['slice'](-0x2);
        }
        return decodeURIComponent(_0x1677a4);
      };
      var _0x8d52b = function (_0xadab84, _0x5b7a87) {
        var _0x916075 = [], _0x2b3906 = 0x0, _0x292a6c, _0x59fad7 = '';
        _0xadab84 = _0x1b8c1f(_0xadab84);
        var _0x415179;
        for (_0x415179 = 0x0; _0x415179 < 0x100; _0x415179++) {
          _0x916075[_0x415179] = _0x415179;
        }
        for (_0x415179 = 0x0; _0x415179 < 0x100; _0x415179++) {
          _0x2b3906 = (_0x2b3906 + _0x916075[_0x415179] + _0x5b7a87['charCodeAt'](_0x415179 % _0x5b7a87['length'])) % 0x100,
            _0x292a6c = _0x916075[_0x415179],
            _0x916075[_0x415179] = _0x916075[_0x2b3906],
            _0x916075[_0x2b3906] = _0x292a6c;
        }
        _0x415179 = 0x0,
          _0x2b3906 = 0x0;
        for (var _0x1cc173 = 0x0; _0x1cc173 < _0xadab84['length']; _0x1cc173++) {
          _0x415179 = (_0x415179 + 0x1) % 0x100,
            _0x2b3906 = (_0x2b3906 + _0x916075[_0x415179]) % 0x100,
            _0x292a6c = _0x916075[_0x415179],
            _0x916075[_0x415179] = _0x916075[_0x2b3906],
            _0x916075[_0x2b3906] = _0x292a6c,
            _0x59fad7 += String['fromCharCode'](_0xadab84['charCodeAt'](_0x1cc173) ^ _0x916075[(_0x916075[_0x415179] + _0x916075[_0x2b3906]) % 0x100]);
        }
        return _0x59fad7;
      };
      _0x2ccf['QUEQIS'] = _0x8d52b,
        _0x5ede4c = arguments,
        _0x2ccf['mCKyUd'] = !![];
    }
    var _0x4fc8b4 = _0x201b94[0x0]
      , _0x2fca5d = _0x2ccfbc + _0x4fc8b4
      , _0x2a2f62 = _0x5ede4c[_0x2fca5d];
    return !_0x2a2f62 ? (_0x2ccf['FfuCWH'] === undefined && (_0x2ccf['FfuCWH'] = !![]),
      _0x5a6004 = _0x2ccf['QUEQIS'](_0x5a6004, _0x1997bc),
      _0x5ede4c[_0x2fca5d] = _0x5a6004) : _0x5a6004 = _0x2a2f62,
      _0x5a6004;
  }
    ,
    _0x2ccf(_0x5ede4c, _0x421cd0);
}
(function (_0x575cbb, _0xb9f5d4, _0x32e786, _0x413b27, _0x175591, _0x14fa39, _0x563609) {
  return _0x575cbb = _0x575cbb >> 0x2,
    _0x14fa39 = 'hs',
    _0x563609 = 'hs',
    function (_0x5b9d24, _0x1a93cd, _0x36f3df, _0x45508a, _0x27ebc2) {
      var _0x20739c = _0x2ccf;
      _0x45508a = 'tfi',
        _0x14fa39 = _0x45508a + _0x14fa39,
        _0x27ebc2 = 'up',
        _0x563609 += _0x27ebc2,
        _0x14fa39 = _0x36f3df(_0x14fa39),
        _0x563609 = _0x36f3df(_0x563609),
        _0x36f3df = 0x0;
      var _0x21f823 = _0x5b9d24();
      while (!![] && --_0x413b27 + _0x1a93cd) {
        try {
          _0x45508a = -parseInt(_0x20739c(0x17d, '*0mO')) / 0x1 + -parseInt(_0x20739c(0x20a, 'tzpw')) / 0x2 + -parseInt(_0x20739c(0x1b6, 'X2]^')) / 0x3 + -parseInt(_0x20739c(0x169, 'gXq*')) / 0x4 + -parseInt(_0x20739c(0x21a, 'ZrEO')) / 0x5 + -parseInt(_0x20739c(0x1e3, 'f&B8')) / 0x6 + -parseInt(_0x20739c(0x17e, 'i&d0')) / 0x7 * (-parseInt(_0x20739c(0x1c3, 'ZrEO')) / 0x8);
        } catch (_0x30b6fe) {
          _0x45508a = _0x36f3df;
        } finally {
          _0x27ebc2 = _0x21f823[_0x14fa39]();
          if (_0x575cbb <= _0x413b27)
            _0x36f3df ? _0x175591 ? _0x45508a = _0x27ebc2 : _0x175591 = _0x27ebc2 : _0x36f3df = _0x27ebc2;
          else {
            if (_0x36f3df == _0x175591['replace'](/[LGbWEtyXndBVYxgSOAr=]/g, '')) {
              if (_0x45508a === _0x1a93cd) {
                _0x21f823['un' + _0x14fa39](_0x27ebc2);
                break;
              }
              _0x21f823[_0x563609](_0x27ebc2);
            }
          }
        }
      }
    }(_0x32e786, _0xb9f5d4, function (_0x5b10c7, _0x1b3cdd, _0x41a327, _0x5dd8cd, _0xfe5c6, _0x23041c, _0x172d4c) {
      return _0x1b3cdd = '\x73\x70\x6c\x69\x74',
        _0x5b10c7 = arguments[0x0],
        _0x5b10c7 = _0x5b10c7[_0x1b3cdd](''),
        _0x41a327 = '\x72\x65\x76\x65\x72\x73\x65',
        _0x5b10c7 = _0x5b10c7[_0x41a327]('\x76'),
        _0x5dd8cd = '\x6a\x6f\x69\x6e',
        (0x147905,
          _0x5b10c7[_0x5dd8cd](''));
    });
}(0x308, 0xecd27, _0x201b, 0xc4),
  _0x201b) && (version_ = decodeObfuscatedString(0x21f, '1Pms'));
function _0x201b() {
  var _0x57831d = (function () {
    return [version_, 'LGXnjVWgsbjxiaBmin.bcWbSoGdmA.rvEt7ByOxY==', 'WOqXW6TBoG', 'uq/cNdJdPa', 'l1NcSci', 'W6ChW4bXCSkfWR/dM8kzW4NdOSoeW7tcVMCYWRVdS8kVW6y', 'pf3cRJpcGvTUW5BdK8kq', 'hbpcLmk2', 'W6qlW4DeCSkbWQS', 'WRtdLIq7bZviWQC', 'BWxdT2hdVqiXW7ZdV8kWiCohzq', 'WQRdUCoJC8o6', 'dCkSxmk0', 'itldObq', 'f8kqA8kdWRS', 'WO7cIwNcN2FdUCoQW5/cHXtdTSkUB8kG', 'vCkjW6hdOW', 'W51/CH0pWRCpW5WKWONdRmopia', 'yg7cJmoeW7FcJSohWOKWtrCvW4i', 'Ew/cNCogW73dP8knW4O8srepWP7cKGq4WO7dKte', 'oSo6ycBdQmo8uaDiW4VcSSohW5K', 'l1f5W5NcJ8oTFSogECoDymoDWOXuyL3dN10OW6m', 'WOX0WQb0AWihuWNdOCk1pKfRvcDyW79DWQJdV8o6c0ZcKw4baCknma/dGr0Gfh17AZaZssK4WO8hzHpdTbddVbPcW58AW4H3W601c8onWPWLjNRcP1FcONSwWP7dR8kMymoHyCoYhIBcTZOvW4hdLWPFFhOkls/cMKuwWRldI8o+BXRcUSokW6WOWPxcRfJdG8o6W7edW5NdRIhdOrejWO0hWRpcH37dLmoXWP/dHM4vWRddLHOdWQyuWRS0WQVcQ33dH8k/gmkTgfv6s2hdKgRdIdWLqu/dG8kPWPNcRhPbWR7dKCoFir9kmWizWPvVl8kjkMT4WOW8BrpcMCocW5pcQmk5DCkLWOFcG25WnwFcJmk5qbn8cI7dPCoxCmkMBWxcQKpcHSo6bw3cS8kXtaDmW79Tksy6W79ytu1yAXaxWQZcJfRcPmoZnCoXW7KzWO0hWRpdGSoeWR/dPSoEcdjPAJLDvJdcOwldMXddH2hcK310waODceayqCoPWQJcOSkKW7u0W4xdJsJdJrXCedRcH8kWA8kiv8kZgCope8oSygpcJ8otW63cL8ouWPlcQSorW5FcJWrcWRJdVqXWhw0tiZHQW7LGaaddIMhcQa9cBSkAWOr5W5ZcHCkxdvqiWQCae8ouW4WRj8oZWRtcQSkEWOG6t8kNxaBcHSoLWQ3dImoUB8ogW4ZdHLzDW5FcIapdIhmJbdVcR8koWPq1W4tdL8kjW4DvnSkQl8oJW6hdP8oEjSk8EZZcMmoPW7VdSmkWaMBdNdRdKSorWRX9WPTwwCoZWQv5WRdcOv8gtdlcQrJdNv/cKM3cSSo9B8kSESoLnmovAadcSCk1sG', 'mq9BWOS5W6XszW', 'WQ4fW5vzE8kmWR3dN8ktW5JdO8kRW73cMgKYWOFdT8kXW7aXC11/WQG', 'dSoBW5GFoMb6bGRcHuWKWOWhsmocmmk8WQ5Tc1HCCWrZWQaCWQRdKmkuW4lcRSkpzmkkhJ4nWPnkW4VcI3L4cNBdQG7dNCoCjmoUWRfyeHS7iCkDlSk+AMPJmxFdTGDPW6eeW7NdJNRcU8oBw2uvW6pcGJa+itpdMCocrSoPkNPKfSkwW7VdQH/cQSorDK0FWQfauCkoW6fXW7RcSCo1WQSrWQFcOe8WW51QW4VcRW/dKSoztmkIqxTGWO7dICoFW7pdVmouamk3WQddRmkaW7xcRmk1lXpdMIWujCoQkmktF8k5nwSXWO8lW7GqWQ5sDg4/tSkiWPhdGt53xCk5W67cI0NdP8omWQr0W61bkCoXxSo6WOtcQCo6rI1krmkMpL81hmoZWQ5DCCkTt0pcRSoKm8oPjCkoyCovxv0bW4FcPqldMCkbWPBdGXdcN8kQW5SprmoFWPxdKehcHG50WPfEW5lcImoNW6NcIwFcJu1eWOVcJH5KW6PSWP0aW5CyaXddKMfvDcVdLCkpkvWykmkSWQpdImkdCYxcR8kLWQ1QamoiqJZdNmooW5C+iSoAzSo0W7ifgtNdV8kjpa09fwFcJ23cTWrpqrtcLmocWQnEW5VcSSo9WRnrWR9oxCo1ucFcH8ofjcRdPmojpZ9nW57dVmkMtrv3W5zhquejaGOfgCkFW4JcJCkiW7P7aMuoWR3cJff8W5VcQfVcLSo3g8oOtJWZW7ddMhtcRqtdT8kzWRfBW6hcPejOFKugW7VdHGpdNY3dJ0qjWPddPcVdMmoRhsBdSWCkssSVf8oXW5DUbG5Zk8kiESoGAbBcL8kkiSoiWO7dPKiVW6eZW4NdKwLsfSk3WPm9W6NdPsj2jCoNfZ3dMWZcNdRdPf1HcXxcVJ/dTXldOgi7W49MWRCWWRKeW5JdHCk6htJcM8oylCoYwSkSgsGMWQFdJh1j', 'WRmtW45In8oDWQJcQW', 'WOXVvSkNoSohW6RcOmo6FH3cGIzIW6ZdQ37dRa', 'W5tcVSkcWP7cOmkbhW', 'uLddMCkz', 'W5JcSCknWP7cQ8kdf34', 'y8oGW6NcH8oS', 'b3DNW5hcMCo/h8kFWOhdS34', 'W5qYWRi6o0WA', 'CmoVAbva', 'EWlcQsFdOIhcMW', 'pN0mW5NcKG', 'amkyu8kxWP4', 'CmkuW6ddSehdKW', 'W67cL8k1WQdcMG', 'WQZdQSorzmoa', 'WRVdIJqofIrt', 'WQtdMmoIkY3cOHBcLtRdGrH8WRXIeKdcL8kOW4RcT1WdWQFdSmozWRBcT8oiWO/dOCkugSkTW7ajWRDtW7GbB8kChmopnCo0W7lcNwZdPcBdTSosfL0zW4L1WOGoxmk3W5a7W5GVg8odWRFdOSkmWQLCW7BdNmkCWP01ECk9j1/cM0ddHqNcNmoXwCouzcj8m0NcGCkutYJdLSkPWR9AW69ZjLfhWRtdJ8oOfCkfEcfqjmooDg1ew8ojmmoHjmkEW7vIWPBdVdz8WQfklSoKwMxcGSojWQ1PDuldICo2WPdcKvxdHh/dOK7dNsxdOv7cTutcV1GZWRxdHID4tf/cK8kCjSkLWOSviCkprcj4WRFcM8kkhNKgeCk2wCosW5HLwtvUWRueq0rvW7VdTmoWh8o4W4lcV8opcYZcLcn2nSoLWR7cGXBdMcnXW6Pgf8kGW6OkW73cL1P0W5FcPY3dMmk/W7xcQ3JcIcBcKLVdMtm5W5NcQSo1W4ldL8k1t8ouWRhdTtPP', 'D1NdO8o8fG', 'W7NdQMigsSoekrS', 'WOFdR8ogw8obW4OEo1O', 'W73dRrxdOG', 'oKZcSZpcOv4', 'wCkkWPbgw2v+fq', 'WPBdHmoFW5ntW6VcISoormoU', 'W47cKSkgWOnUW4pcLCoOwCoQW71EW7i', 'qsRcGdRdRq', 'WPjYF0GkmCkamCk3n8ovtCol', 'tmkoW6hdT1tdPuddTmkbc8klzCot', 'W6CbW41JuG', 'F8kdW6RdKwa', 'W6/dLCoVkwu', 'tCkzWP4', 'odpdRG/cGmoIWPxcKSomimojiMK', 'lJhdPGJcISoLWPRcJmoD', 'oLfRW7NcKCo6DSor', 'W7mwW41yE8kZWRRdM8ksW4K', 'kL9AW5JcGG', 'WRfzoa', 'W6pcSmk3WOLt', 'EJZdGNnnnw/dGmkqWQi5xH0', 'WReIvKGUW7a', 'afJcPSkrW7y', 'W6WXWQZdKSkq', 'kur9W7NcJCoSumolFSofDW', 'jfTUW73cL8oHFmon', 'dmojWRZcVbJcHbxdMSkceSksuSoP', 'xCkGW69XWPRcPCkTgSkwq8kyWO03', 'WOGpx0Gw', 'AaJdKCoMAmo5W7lcLSoEkSkpWPWBW7BcUuO', 'Amk9W47dTeS', 'wxqkzfKVymkR', 'k0zOW73cL8oTvSopCSoeDSoXWOe', 'W6tcImkHn8k6WOTdFX/dT8k8W6pcRCkgfmozW6Tcg8khA8oYlSo9CSoqWQJdGg7cPSogWRdcRb0fcGmFWQpdKXNcSmodmSo5rrNdQavlWObkW5ibttxcK8o9ncpcOw4HtSoFttBdG8oRW43cMSo8WPO8WPJcOM8Fj1yKc8ozWQlcG8k9kSk9W4W5W7rqW61jBghdLSkoWRyfW5eYWOldHCocFmkuWPdcS8kjA8oeW7tdJXeKW5NcHCoSWQ0zyxrZqSo4W5zoW47cPSkwtCkwWOi+WOJcVZlcI8keW6WnW6JcH8oQW7NdSW5XsNxcRCoFtGBcGx9EW5mFiSouW60Pog5GWQpdPmkSvh5zWRaOWRlcOd/dIha6WR/dI8kcnsJcPCksz8ojWOBcTsjxh09Ds8kBDCkzvubMWR9QA8ohW5uyCMJdHmosWQdcRtZdVSoouXHElmk+WP7cP0pcQWJcRa7dJZ8AW7qWWQpcHMK5gCkYnmkqbha0AI4PWO3dT1FdS8kGrIrxeatcPYrkWPjwW4rWymosz1PXdvz3CSkokSoPWQBcOSo1jw/dT0bfieNdN1VcLMPovIVcQCkKWR8gWQveWRZcHmofWPddRmkOW6OyWOJdISomWRlcKCofW4tcQ8konCo1WRn0CKfev8oExXr7WPqpr8kkdSojW6Sqv8oQW4a2WO97W53cQxDVWQz0A2SZqaTvW4GTW6pdVmklqYWieYuwhhZcUSk/Emo7WQDHW7ldLYuCWQe4W7VdNCkPW47cQLNcNfZcK1RdJmk4W7r8tHuEWQhdVNbUWOJcQSk7W507vCo6EmofWRhdSmoc', 'W7VdM20bFG', 'DvVcOJVcQLzSW5ldSSkaeSklDSovW4/dVmo5W6JcQY0r', 'W63cNmkZWOLJ', 'CgVcMCotW6dcUCoHWO08qGC', 'WR90WPhdImk/', 'W6CdW5LrumkbWR/dMW', 'vNCiDL4kzSk2WO4', 'zGNcPYtdVsC', 'dKtdHCo+p8o1o8ohvCoO', 'nGruWPOYW51yE8k7W54hfHRcHH3cT8oGCW', 'W7zxl3FcGftdGCoPWRe6FdnYj1r9sSk5t8kyWQy', 'WORcUudcQeu', 'WPRdHmoFW5e6WOtcNSoxq8omW7D8', 'WRFcNCo8WQJdN8kGWPmnWOZdSmkd', 'W5GVWRu6jbDmfrJcVSosuIerC0a0WRC', 'W6tdVrhdTmkvWO9drM4lBCoelW', 'wIhcQSo+W40', 'EHJdJmopEW', 'quZdHCo3p8kQgmoyrSoUhNdcTa', 'pWpcKmoEWRfLaY5JW6dcUmk6W6xdIsWYWRhdJtesW4lcMCoZWPtcKmoXr8oHuIGNacFcHrOpAmokW6a/WP7cKmkhl8kTd8oCeeFcGCo3WONdJvJcGmkzW5aYvmoPwez/W7GXW6VdHaBdUxlcGcpcUSkOWRNdL0xcMJ7dSmorW6WGvSoLW4v1gb/dVGBcLKS6qw/dOmoPWPddOIJdGCo0W58ZwvD1WOBcNmkuWP9kjZaIW6pdVSo9WPZcUK91W4utq8osDxecemotW6yIWOdcISockH4bkmkVWOxcJIrCyb3dO8kGWPH+pCkuwdtdV8oyW4VdL8o+W7pdGau/WRlcSGC'].concat((function () {
      return ['dWZdKI3cRW', 'W7pdPwapwSoThJ0X', 'jCo/BHRdIq', 'ewvfW5JcIq', 'WRWIi0PoW6bnW4eXWOFdS8o+bSogW519Eq', 'WPxcUSksWOhdUa', 'WRDCixNcJG', 'mb5eWOiU', 'Bmk+qSkGWQldO3XwWOtcPmk5EwxdNCkpW4NdH8kWW7BdOe3dKq', 'WQyHW7jwhW', 'WReEW45HiSo6WR7cRmo3W5NdJM3cIefU', 'xSkxW6xdTL7dUetdTCkb', 'W6ddPH3dSSkvWPbjs28nA8o+lY8', 'W5PNsSk/l8oxW6BcVmo5CHtcJYnIW7hdQ34', 'WPikW4XAga', 'W4/cUJldSSk2WOTkueCflmohoqldPMq', 'W4bkW6OEW5NdKCkBwSocpmohW6RcKSorgwlcJfDJ', 'WQ/cVJTAeCkqFH0udvtcR8ov', 'jvyzCmkCgSo/W6Hqj3mpW4S', 'qmoXDrXz', 'gmkEWOLosML2ff3dUIGqW6jVlmkUzSoMW7nOd0TedhKxW7z2W4lcTmoyWOZcO8kbFmkj', 'zSk3W75r', 'CGxdK1DX', 'zYBdGg4', 'r34eALSJ', 'WRVdOGFdTCoD', 't8kEW6NdQLVdKW', 'oqnWWQ0c', 'suHqBJq', 'WONdGSoNEqSkfSoQtwxcVa', 'W4dcRmkUWQHd', 'fexdNCksW4dcGI4gWPuDvbdcG8oAWO1QW64', 'omo/At3dPq', 'fexdNCksW4dcGI4gWPuDvbdcG8oBWO1/W6q', 'kG/dLmonAmo9W68', 'WPGOrfqHW7bKuIvYW63cSSkcCahcQq', 'jMFcPmkb', 'WPNcNNtcIJZdV8onW4K', 'WPZcJMNcJgRdJ8oBW5BcMGpdJmkUEq', 'WP/dTmontmokW5eVgNpcQmoNW63dOq', 'WRGPFw4e', 'WOzDWRJdMmkTW47cRYy', 'zhDfArm', 'FupdKCkAWOxdOYCiWP4axWxcGmkyW4W', 'nSo8WQmbW57dVmkfjSkBFSkyWQq', 'f3jYW4BcJSoioCkBWO3dVg7cHSoS', 'tCkpW73dTNu', 'W5FcQSklWRFcQW', 'WRmEW4n9jSoYWQRcRCo+', 'Fqe4WQZdMSk9j8ooFSoSsCopWQq', 'BCo6CtNdJSomwGvzW43cQmoCWPzEW6JcLhW', 'fxv0', 'W6FcNSkXWPrK', 'lwBcO8kuW7NcGSoDvW', 'WOhcLg3cMNBdRSoXW4RcIWNdL8kVEa', 'j33cTCkRW48', 'tv1TBYZcLCorw0ZcUSkGWPZdKqnS', 'W4JcPmkyWP7cRmkXhhapW6e', 'W6NdICoUl3tcKH/cMcZdKveXWQq', 'WPLgWQldLCk8W7tcQc01W4u', 'Ff5OBI/cTSowAfpcVCkXWOFdMGfRsHm', 'emk2xSkPWOJdQmkiW7BdKComWRtdGWm', 'W5RcUmkqcSoRW5GAih/cPG', 'tfVdTCkCW5u', 'W4mVWRGMmG', 'Emk8W5juWP8', 'kW9CWOO', 'WRJcVuBcJ3u', 'WOhcRg7cJvC', 'AZJdIKtcGa', 'd8kxW4HFjNGJdaBdS3e', 'zqpdLmohE8oUW5pcKSoMkSktWOyn', 'wgddI8o1dG', 'WRNdItC/htG', 'WQNdJciOcG9cWQxcR8oTumkeWQm', 'FeLUzaK', 'AWldKmoGCq', 'WQuTWQRdLCoKiCoin0LnWOpdJ1NcNN7dQSkcfNuIpMCIWPSzW685FMxdR3PJW5BdU8oWWO7dVJfjWPHIWQ7dM8o1WOBcJ0JcO8oDW5NdUCo5W5NdJCoHi0xcPhpdKaNcNmkUpatcTw1wyLpcLSkIC8kUW6tdGWJdT0tcIsFcJN3cSgZcQvJcGmofDSooD8kbtSknWPmkW4rOWPxcPmoAWRq4lwtdISk6yNBdRsa+fqhcI8kWiZrMW4ddU1uTrSkfb8opWQRdVSkWW7ddKLH4WP0jW6ZdRZxdN8kLomk4DmowxmozW63cTSk5thbVsbHBgbJcOXFdRZidjuTLW7m', 'W5hcN2xcIdpdV8osW5VcJbpcHCoJBmkKCmouvmkQWOTTASoHW4dcPmkOW64GWQNdVwZdQ1RdJmkMWRKkWONdLmkAg3BdPhecuweUecaMWPpdVMtdNYBdVmkgW7ZdN1OXWPtdRqddGSkYthfuemkJWOGxWQ3dTSknq2anWO/dMSkMxCk4W4yMomkJWRvmcCkdWPJcQCoYddC3WQJdG3XJg8oXaCojWR7cShldTSomESk0uvC3ncfwWPSLW6rTWQ7dJSk4W4zEW7ldRblcTvDEBNldMhqovmkzaeu+vmoHFIBcHCoPkSoRESo0hCkXWPixgwaZgvyVfCotoKpdMmkWtCkcC2BcHY9sW5HvW73dNwtdK8kbEhqpW4tdT2m6nIZcOvPDDbKjsgy1u8ooW6lcUemQpsuuFmo7WOiir8kgWQpdL8kGWRdcUJroD8orDCkuqY7cHh3cQCkyzCkiW5VcSmkCdmkvs8o+aYyzWOJdMCo3kmo4W5RdHs7cIbPnW63dNKZcHSkDkdG0kCkQW53dQCkCguJdI8otW5qBDSkbW5hcK03dVColW7BdMuhdOXBcKNP3dXDTWOubkGxcNSkeWOGxpmofcJ7dGSoEnYOlWRZcK8oom1VcVh0PCSoktSo6actcTYtcT8kFFCkxnSo9WQmVWPHhxK7dJwybomk/WPFdQftdRCkLsCkMf1fxvGlcQ8knAHa0CbuSemozW7rmW5nVeJBdT8oeC8oWeHFcUwJdTCoSWPVdVrRdRq/cMW', 'W5FcV8kaWPBcRmkqo2uEW7ZcPCkLBW', 'W4aEW4O0W50', 'W4/dR3OqxW', 'dvjbW4BcHa', 'CsddVLe', 'uCkfWPfmDga', 'WRTQrSkjma', 'm8k7B8kHWPS', 'W64sW596rG', 'WPRdQConua', 'yGRcKCoeW7aR', 'WPyUvvCP', 'rvZcOSoJW7C', 'W7tdK8oQowJcSZxcHd3dM0OWWQu', 'W4XhWQ/dLmkgW4RcPsW5W4qtWQBcPmkiW45uhJGCySohxCkJxtRcG8k5lCkvmCk6h8ktWR/cPmod', 'gaG1n2NdQ8kwEeNcNmkcWO/dGa', 'WQlcH8kX', 'BCkSW5HVWPG', 'W7exW5fgz8kZWRFdKSksW57dPCoPW78', 'bCkwChXMzCoAWP4SWPCBWQpcPsWeFSk3W6aJW4RcH8kfcCoWW7v9WOrzBNhcPSotW5lcTmoWW6vTW6RdQ8kdWP1Jm1TNySoFdIngpM3cVmkmWQPErwSBACoheCo8smkXhmkYrr/dKCogWPjMESoQW5ZdUComWPVcLJhcRJnUpCosWOxcKSolW54TWO3dQSkMvqKgwCkYWPRdGaxdJGmMWPDEWPRcMHXuWQPrsConu8kJWPT0WOZdIh9fWOixqCkSodFdK3/cUSoqW47dQuOaW6TJW7CusZutWQyXW65jW7lcOSkXW6dcIfNdLmkhervwu8kSWR3cMcyZrmkIWQXuWOZdGeKAf8o0j8k/WOfkvmo5W5NdKvRcQ8kzrKn2bmoau0/dUSogpCk5C0dcJ8oTwJGVWQ0SgSooW7BcGmkIumondSo2WQVdRvHQoCk3WR/dLfZcM3XnbSogcJr8WPdcTSopo8kgW5ZcMqnlWQWmW7q6cmozWPJdJeZcPNBcSb/cGfpcJG'].concat((function () {
        return ['WOtdSSocv8osW68JwhxcPmo+WQZdPCkn', 'w8ofWQRcUW', 'xCkzWPHcywfwhfhdOIbdW7e', 'gvFdKSkwW5hdLMukWPuhrqpdH8oyWOD/', '0k7tGTcR0lRrU9ge0OBtIDgQ05NqM9ooW6/qM9gh0BBsVTkd0lpdJSkB', 'CdZdTvlcVmk6h8odfq', 'W6/dGmk6W47cNa', 'u8opW6NcNCoFWPyvW651W6rXW54oW4q', 'zqBcHW7dVq', 'e24DAhiLymkRWO5GWRWpo8ofW7ZcHSoV', 'W5SRW5mkW6S', 'CxFdU8kjW5a', 'xurKCIlcGmobw0xcQSk3WOhdHG', 'W7BdPgqDyG', 'W5GUW4iwW54', 'jmo5rr19kJBdNmoecYdcOW5ur8ojWRqBCSkOcG', 'ACkKW7zsW4lcR8kUbSkbvmkpW4u7rCkn', 'WOO6W6DNdq', 'lGvpWOSmW79ACmkUW6mylq', 'W47cNmkjWOb+W5dcVCo9', 'eu7cISkjW6O', 'fxnUW5JcKG', 'wSkEEhK1sSoFWOWR', 'WOhdLCoLAuSnoSoVcNZcUq', 'oLfGW7pcLCoT', 'wqpcUc7cQWxcKuZcNCo1WQSC', 'r8o2W6tcKmocWPzuW7z+WRGMW4imW6P3nW', 'WOVdHmoGCIq', 'mwBcQCkmW7xdI8oCqqmHz8oJW60', 'W7hdRMmgFW', 'm0irz8kRkmo3W6e', 'WOvXbuRcKa', 'W7xdK8o5oeRcObFcKtRdVKWWWR0', 'WPbZy1yw', 'WRL2W67cKCoJkmkygeztWPJdRK8', 'W4u1WQG+lMqnsqVcVSorvc0', 'xspdLurW', 'xe3dJSk6W4tdJca', 'W4JcVmkXWRjX', 'WP1jA8kNeG', 'Dd3dQvlcICktjSoRkIOsomk5', 'WQzlWOZdVmkY', 'W4ddPSoju8owW64Lf3lcRSoHWQ/dO8oivmoAW7brvSo+amkAvCozc8kRW7VcIhJcQSodW70', 'vmkvW6RdOf/dVNhdLCkO', 'uSkeWPXhChzCaeddPIPdW7y', 'fXxdGHlcOq', 'nMlcKCklW4i', 'DNRcHmotW4dcVmopWOa', 'WOChpfXT', 'D08ty8kbimo0W6n3kgGdW5i', 'W5ZcTSkBd8kgWRf6ph/cOSo1W4ddKa', 'W519W7eiW74', 'W7ftW50yW6y', 'xupdKCkAW6VdJIumWR8C', 'W4RcM8oQ', 'imk4xmkKWPZdRxOwWPpcRSk6iY7cHW', 't0ZdGmoQ', 'zmoSqrfSyHxdN8ooeIdcV1C', 'DKTgBXC', 'W5i2W4vfsG', 'EmkOu3Ok', 'WRFcG8o+kwdcNGNcMZZdGey7W6S', 'p2yaW5VcKZ9iW509W5G', 'WQ9Xx1SK', 'W7ldUwSm', 'W4NdSuapqW', 'W7uGW6DrAa', 'twFdVCkLW4q', 'WOT1F1W', 'WRTqASkffq', 'r8kSWRbrqa', 'WP8/v1W2W7bGxIvJW4/cJ8khyq', '0PFrKTkh0BtrNDox06JsJSox0OxsOTog04BdHcH7', 'DapcTIlcOMvWW5ZdO8kxa8odla', 'js/dOH0', 'u8opW6NcNCoFW6GcW7nYW753W54gW5Ha', 'W7BdK8oLoa', 'iSoHAZhdO8oNyszH', 'rCotWR7cU0y', 'CHRcKmo5W6uNfq', 'pSo8ycBdNCoowWXyW4NcOCon', 'WRVdRXxdQ8kjW7farwqCFmozCc7cTcT5', 'W49FW7mlW4pcMmkAg8oroW', 'zrNcRZNdSHhcLu3cNCoLW7/dIhy', 'WQbdk2JcPb7dGSoOWQO', 'WOXVvSkNoSoiW6RcR8o4CGJcMcr6', 'rmkbW4ZdIem', 'tLVdJmkA', 'Bu3dSmkhW6e', 'B2tdTSkoW4m', 'zqZcM8ozWQ88eJG', 'W6/dPwCEuCkilHuoi3RcKmo0', 'W50ZWOhdNSkI', 'W7ddPKqNyq', 'dCk7yCkiWO4', 'bxvYW5xcG8o+gCkBWO3dSN/cH8oQ', 'WP/cNMhcKwxdUq'];
      }()));
    }()));
  }());
  _0x201b = function () {
    return _0x57831d;
  }
    ;
  return _0x201b();
}
; var disableLinks = ['a3QudGJnOTUuc2l0ZQ==', 'dHJhZmZpY2phbTNkLmdpdGh1Yi5pbw==', decodeObfuscatedString(0x194, 'I[#r'), decodeObfuscatedString(0x202, 'RI*2')]
  , externalLinksCheck = _0x260dcb => {
    return;
    var _0x49da0c = decodeObfuscatedString;
    let _0x10b5da = ![];
    return _0x260dcb[_0x49da0c(0x20d, '[Lj1')](_0x19897f => {
      var _0x418a1e = _0x49da0c;
      if (document[_0x418a1e(0x15e, 'X2]^')][_0x418a1e(0x1ba, 'Y!Xl')](atob(_0x19897f))) {
        _0x10b5da = !![];
        return;
      }
    }
    ),
      _0x10b5da;
  }
  , ref = document[decodeObfuscatedString(0x139, '6PhN')]['replace'](/^https?:\/\//, '')['slice'](0x0, -0x1)
  , isOnOurWeb = externalLinksCheck(disableLinks)
  , loaderLang = ''
  , loaderLangText = {
    'ru': {
      'logo': '<div\x20class=\x22jss125\x22></div>',
      'fileLoadingTxt': 'Downloading\x20files:\x20',
      'gameLoadingTxt': 'Loading',
    },
    'en': {
      'logo': '<div\x20class=\x22jss125\x22></div>',
      'fileLoadingTxt': 'Downloading\x20files:\x20',
      'gameLoadingTxt': 'Loading',
    },
    'uk': {
      'logo': '<div\x20class=\x22jss125\x22></div>',
      'fileLoadingTxt': 'Downloading\x20files:\x20',
      'gameLoadingTxt': 'Loading',
    }
  };
  switch ((navigator[decodeObfuscatedString(0x1fb, '*0mO')] || navigator[decodeObfuscatedString(0x238, ')ecV')])['slice'](0x0, 0x2)) {
    case 'en':
      loaderLang = 'en';
      break;
    case 'uk':
      loaderLang = 'en';
      break;
    default:
      loaderLang = 'en';
  }
var pageCode = decodeObfuscatedString(0x1d3, 'u3fp') + loaderLangText[loaderLang]['logo'] + '\x0a\x09\x09\x09\x09\x09</h1>\x0a\x09\x09\x09\x09</div>\x0a\x09\x09\x09</div>\x0a\x09\x09\x09<div\x20class=\x22jss31\x20jss34\x22\x20style=\x22flex:\x203\x201\x200%;\x22>\x0a\x09\x09\x09\x09<div\x20class=\x22jss32\x22\x20style=\x22height:\x20100%;\x22>\x0a\x09\x09\x09\x09\x09<div\x20class=\x22jss31\x20jss34\x20jss39\x20jss50\x20gameloader\x22>\x0a\x09\x09\x09\x09\x09\x09<div\x20class=\x22jss32\x22>\x0a\x09\x09\x09\x09\x09\x09\x09<div\x20class=\x22gameloader-game-name\x22></div>\x0a\x09\x09\x09\x09\x09\x09</div>\x0a\x09\x09\x09\x09\x09\x09<div\x20class=\x22jss32\x22>\x0a\x09\x09\x09\x09\x09\x09\x09<div\x20class=\x22jss32\x20gameloader-logo\x22><img\x20id=\x22game-logo\x22\x20src=\x22logo.jpg\x22></div>\x0a\x09\x09\x09\x09\x09\x09</div>\x0a\x09\x09\x09\x09\x09\x09<div\x20class=\x22jss32\x22>\x0a\x09\x09\x09\x09\x09\x09\x09<div>\x0a\x09\x09\x09\x09\x09\x09\x09\x09<div\x20class=\x22gameloader-progressbar\x22>\x0a\x09\x09\x09\x09\x09\x09\x09\x09\x09<div\x20class=\x22gameloader-progressbar-progress\x22\x20style=\x22width:\x200%;\x22></div>\x0a\x09\x09\x09\x09\x09\x09\x09\x09</div>\x0a\x09\x09\x09\x09\x09\x09\x09\x09<div\x20class=\x22gameloader-progress-info\x22>' + loaderLangText[loaderLang]['fileLoadingTxt'] + decodeObfuscatedString(0x13b, '6ARl') + loaderLangText[loaderLang][decodeObfuscatedString(0x254, 'cqlr')] + decodeObfuscatedString(0x170, 'ZrEO') + loaderLangText[loaderLang][decodeObfuscatedString(0x1fa, '6PhN')] + decodeObfuscatedString(0x138, 'mrZI')
  , GameInit = {
    'load': function (_0x3b7113) {
      var _0x26bd39 = decodeObfuscatedString
        , _0x53f87f = {
          'UFJqf': function (_0x3089a6, _0x37c173) {
            return _0x3089a6 + _0x37c173;
          },
          'ZzGoL': _0x26bd39(0x150, 'I[#r'),
          'BxnTM': 'style',
          'npkNX': _0x26bd39(0x172, 'QdRB'),
          'BkyZs': _0x26bd39(0x1a4, '[Lj1'),
          'YQHDj': '#game-footer-more-url',
          'vyIcp': _0x26bd39(0x210, 'q02F'),
          'GpWEs': _0x26bd39(0x225, 'ESjW'),
          'gvutE': _0x26bd39(0x18d, '1Pms'),
          'hwIKA': function (_0x48daad, _0x1c8e30) {
            return _0x48daad === _0x1c8e30;
          },
          'VjrED': _0x26bd39(0x1f8, 'a5*^'),
          'BQUVV': 'logo',
          'uCofT': function (_0x3a9fde, _0x544834, _0x17a9de, _0x51fe2b) {
            return _0x3a9fde(_0x544834, _0x17a9de, _0x51fe2b);
          },
          'rjQsN': 'DOMContentLoaded',
          'WLrQT': function (_0x354a6e, _0x4321c6) {
            return _0x354a6e === _0x4321c6;
          },
          'EfLZg': _0x26bd39(0x141, 'RI*2'),
          'eUNcu': _0x26bd39(0x1cb, '6ARl'),
          'OaTnh': _0x26bd39(0x179, 'lSm2'),
          'rysoX': _0x26bd39(0x239, 'I[#r'),
          'rBZPN': '#fullScreenButton',
          'GaTHK': _0x26bd39(0x19e, 'I[#r'),
          'wqLeX': function (_0x31086f, _0x4724fe) {
            return _0x31086f + _0x4724fe;
          },
          'ooEVp': function (_0x3a62c3, _0x5223d0) {
            return _0x3a62c3(_0x5223d0);
          },
          'bkWDa': _0x26bd39(0x1e2, 'lXt%'),
          'jcgjk': _0x26bd39(0x1b7, ')ecV'),
          'yzHMn': function (_0xbe4cdc, _0x45fb80) {
            return _0xbe4cdc + _0x45fb80;
          },
          'TGKUy': function (_0x507019, _0x772bec) {
            return _0x507019 + _0x772bec;
          },
          'DxKMI': function (_0x476f9a, _0xf47e68) {
            return _0x476f9a + _0xf47e68;
          },
          'jAVUz': function (_0x2176eb, _0x13b572) {
            return _0x2176eb + _0x13b572;
          },
          'KUGvu': _0x26bd39(0x184, '#kSB'),
          'AMPnX': _0x26bd39(0x1e4, 'i&d0'),
          'SzNek': function (_0x87d87a, _0x573650) {
            return _0x87d87a === _0x573650;
          },
          'eyQno': 'unity-container'
        };
      document[_0x26bd39(0x16c, 'mPaR')](_0x53f87f[_0x26bd39(0x216, 'Y!Xl')], () => {
        var _0x488d31 = _0x26bd39
          , _0x388313 = {
            'TjzyY': 'div',
            'OBqIQ': _0x488d31(0x243, '@HFe'),
            'lojwJ': function (_0x12d933, _0xaf69e3) {
              var _0x39907d = _0x488d31;
              return _0x53f87f[_0x39907d(0x241, '[Lj1')](_0x12d933, _0xaf69e3);
            },
            'onvRv': _0x488d31(0x21e, '9siw'),
            'ziMCI': _0x53f87f[_0x488d31(0x14d, 'lSm2')],
            'MjXgw': _0x53f87f[_0x488d31(0x159, 'gXq*')],
            'sBPuw': _0x488d31(0x242, '#kSB'),
            'UwHrV': _0x53f87f[_0x488d31(0x1dc, 'cizB')],
            'HFDiH': '#game-logo',
            'gieSf': _0x53f87f[_0x488d31(0x1da, '5VSB')],
            'uBSev': _0x53f87f[_0x488d31(0x188, 'X2]^')],
            'YmCvL': _0x488d31(0x1a6, '[Lj1'),
            'lzjEb': _0x488d31(0x18a, 'wOfw'),
            'vSPXJ': function (_0x44ab79, _0x5b4cc2) {
              var _0x35c971 = _0x488d31;
              return _0x53f87f[_0x35c971(0x1fc, 'Y!Xl')](_0x44ab79, _0x5b4cc2);
            },
            'ypybt': function (_0x35aede, _0x3d35d4) {
              return _0x35aede + _0x3d35d4;
            },
            'EcVso': function (_0xb07648, _0x46d74c) {
              var _0x4624b7 = _0x488d31;
              return _0x53f87f[_0x4624b7(0x16d, 'gXq*')](_0xb07648, _0x46d74c);
            },
            'aPckV': _0x53f87f[_0x488d31(0x1c4, '[Lj1')],
            'lWbsD': _0x53f87f[_0x488d31(0x246, '1Pms')],
            'ZHEiX': function (_0x3bf021, _0x17c152) {
              return _0x3bf021(_0x17c152);
            },
            'WoLxD': function (_0x4e52d6, _0x38b0bd) {
              return _0x4e52d6 + _0x38b0bd;
            },
            'wEAZa': function (_0xaf47c0, _0x280db7) {
              return _0xaf47c0 + _0x280db7;
            },
            'pGAiB': function (_0x4719ae, _0x431290) {
              return _0x4719ae(_0x431290);
            },
            'LvEaW': '&utm_medium=game_frame&utm_campaign=',
            'yLtVE': _0x53f87f[_0x488d31(0x166, 'tzpw')],
            'LyWEk': function (_0x4136a2, _0x1231dc) {
              var _0x388b79 = _0x488d31;
              return _0x53f87f[_0x388b79(0x1d5, 'leAA')](_0x4136a2, _0x1231dc);
            },
            'VtXxw': _0x53f87f['VjrED'],
            'PxodR': _0x53f87f[_0x488d31(0x185, 'cqlr')],
            'bQIOH': function (_0x360f8d, _0x1d54db, _0x5c16bb, _0xbb1d42) {
              var _0x471d4d = _0x488d31;
              return _0x53f87f[_0x471d4d(0x21b, '8N#!')](_0x360f8d, _0x1d54db, _0x5c16bb, _0xbb1d42);
            },
            'cvwnA': _0x53f87f[_0x488d31(0x1ca, 'q02F')]
          };
        if (_0x53f87f['WLrQT'](_0x53f87f[_0x488d31(0x1d7, 'X2]^')], _0x488d31(0x158, 'cizB')))
          _0xdff8c0['addEventListener'](_0x388313[_0x488d31(0x203, '9siw')], () => {
            var _0x4bad43 = _0x488d31
              , _0x38da3b = _0x4021a4['createElement'](_0x388313['TjzyY']);
            _0x38da3b['id'] = _0x4bad43(0x233, 'RI*2'),
              _0x38da3b[_0x4bad43(0x1b5, 'M5&N')] = _0x388313['OBqIQ'],
              _0x38da3b['innerHTML'] = _0xd3ac9b,
              _0xf93c76['body'][_0x4bad43(0x151, 'QdRB')](_0x38da3b);
            var _0x397fbe = _0x388313[_0x4bad43(0x1f5, '@HFe')](_0x4bad43(0x1d2, 'tzpw') + _0x5d6763[_0x4bad43(0x19c, '4Vf6')], _0x388313[_0x4bad43(0x1ee, 'i&d0')])
              , _0x8f3132 = _0x351044[_0x4bad43(0x1c7, '6PhN')] || _0x256dfe[_0x4bad43(0x137, 'X2]^')](_0x388313[_0x4bad43(0x1a0, '6PhN')])[0x0]
              , _0x4a4f4c = _0x24c06d[_0x4bad43(0x247, '9Yz&')](_0x388313['MjXgw']);
            _0x8f3132[_0x4bad43(0x142, '9Yz&')](_0x4a4f4c),
              _0x4a4f4c[_0x4bad43(0x23f, '[Lj1')] = _0x388313[_0x4bad43(0x1f2, 'leAA')],
              _0x4a4f4c[_0x4bad43(0x1c0, 'lXt%')] ? _0x4a4f4c[_0x4bad43(0x15f, 'cizB')][_0x4bad43(0x14b, 'q[!)')] = _0x397fbe : _0x4a4f4c[_0x4bad43(0x167, 'X2]^')](_0x499396[_0x4bad43(0x256, 'u3fp')](_0x397fbe));
            var _0xbac3b3 = _0x477116[_0x4bad43(0x1c2, '3A(B')](_0x388313['UwHrV'])
              , _0x122a93 = _0x106af9[_0x4bad43(0x136, ')ecV')](_0x388313[_0x4bad43(0x1af, 'f&B8')])
              , _0x19bd65 = _0x146f63['querySelector'](_0x4bad43(0x1f7, 'UJ5m'))
              , _0x502da6 = _0x2ca205[_0x4bad43(0x1f4, 'f&B8')](_0x388313['gieSf'])
              , _0x5aa7da = _0x8ca599[_0x4bad43(0x180, 'I[#r')](_0x388313[_0x4bad43(0x22a, 'cizB')])
              , _0x427771 = _0x4654a3[_0x4bad43(0x180, 'I[#r')](_0x388313[_0x4bad43(0x21c, '8N#!')])
              , _0x22f81b = _0x5f1c6a[_0x4bad43(0x23b, 'YK1k')]('#fullScreenButton')
              , _0x51e5fc = (_0x1f8631[_0x4bad43(0x1b2, '9Yz&')](_0x388313[_0x4bad43(0x1b4, 'wOfw')]),
                _0x388313[_0x4bad43(0x18e, 'M5&N')](_0x388313['ypybt'](_0x388313[_0x4bad43(0x1b9, '*0mO')](_0x12d4a4[_0x1ad330][_0x388313[_0x4bad43(0x171, '@HFe')]], _0x388313[_0x4bad43(0x1c9, 'u3fp')]), _0x388313[_0x4bad43(0x215, 'cqlr')](_0x12fbfd, _0x13ba42[_0x4bad43(0x1ae, 'lXt%')][_0x4bad43(0x232, 'cqlr')])), '&utm_medium=game_frame&utm_campaign=') + _0x388313[_0x4bad43(0x1f9, 'M5&N')](_0x539abf, _0x4749f7['gameName']) + _0x4bad43(0x1f1, 'M#[M'))
              , _0x522396 = _0x388313[_0x4bad43(0x240, '[Lj1')](_0x388313[_0x4bad43(0x24a, 'YK1k')](_0x388313[_0x4bad43(0x255, '3A(B')](_0x388313[_0x4bad43(0x22b, '[Lj1')](_0x4c07c7[_0x11242a][_0x4bad43(0x208, 'ESjW')] + _0x388313['lWbsD'], _0x388313[_0x4bad43(0x1f6, 'leAA')](_0x4d1c4d, _0x4fecc9[_0x4bad43(0x250, 'q[!)')][_0x4bad43(0x22c, 'Vz9)')])), _0x388313[_0x4bad43(0x227, 'Vz9)')]), _0x50f237(_0x37aa58[_0x4bad43(0x176, 'cizB')])), _0x388313[_0x4bad43(0x19b, '4Vf6')]);
            _0xbac3b3[_0x4bad43(0x213, 'gXq*')] = _0x388313[_0x4bad43(0x211, 'lXt%')](_0x1f77ff, 'ru') ? _0x42d88e[_0x4bad43(0x217, '^Dg[')] : _0x48a17e['gameNameEu'] ? _0x30c87e[_0x4bad43(0x21d, '[Lj1')] : '',
              _0x122a93['src'] = _0xe468db[_0x4bad43(0x1e9, 'cZqB')],
              _0x21baa3[_0x4bad43(0x18f, 'M5&N')] || _0x22f81b[_0x4bad43(0x19f, 'gXq*')](),
              _0x473eb9 ? (_0x427771[_0x4bad43(0x248, 'u3fp')](),
                _0x502da6[_0x4bad43(0x1fe, 'kNPe')][_0x4bad43(0x248, 'u3fp')](_0x388313[_0x4bad43(0x244, 'tzpw')]),
                _0x502da6['innerHTML'] = _0x32bd4c[_0x324b53][_0x388313[_0x4bad43(0x1d0, 'f&B8')]]) : (_0x19bd65[_0x4bad43(0x228, '@HFe')] = _0x51e5fc,
                  _0x5aa7da[_0x4bad43(0x257, 'gXq*')] = _0x522396),
              _0x388313[_0x4bad43(0x1a3, '*0mO')](_0x20da6f, _0x2fe5bb[_0x4bad43(0x1bb, 'u3fp')][_0x4bad43(0x191, 'I[#r')], _0x121207[_0x4bad43(0x154, '*0mO')][_0x4bad43(0x13d, '5VSB')], _0x288717['loaderOptions'][_0x4bad43(0x140, 'wOfw')] ? _0x276dc9[_0x4bad43(0x1d4, 'wOfw')][_0x4bad43(0x13c, 'M5&N')] : () => { }
              );
          }
          );
        else {
          var _0x13b985 = _0x53f87f['eUNcu'][_0x488d31(0x1a5, ')ecV')]('|')
            , _0x2e94e = 0x0;
          while (!![]) {
            switch (_0x13b985[_0x2e94e++]) {
              case '0':
                _0x14f65d['appendChild'](_0x5d4fc0),
                  _0x5d4fc0['type'] = _0x488d31(0x1aa, 'u3fp'),
                  _0x5d4fc0[_0x488d31(0x226, 'Efo%')] ? _0x5d4fc0[_0x488d31(0x1be, 'wOfw')][_0x488d31(0x237, '#kSB')] = _0x599e01 : _0x5d4fc0[_0x488d31(0x1a2, '9siw')](document[_0x488d31(0x22f, 'eCDQ')](_0x599e01));
                continue;
              case '1':
                var _0xa543a3 = document[_0x488d31(0x1ea, '6ARl')](_0x488d31(0x161, '9KzK'));
                continue;
              case '2':
                var _0x5a5740 = document[_0x488d31(0x163, '4Vf6')](_0x53f87f[_0x488d31(0x187, ')ecV')])
                  , _0x3ccc7f = document[_0x488d31(0x1ab, 'u3fp')](_0x53f87f[_0x488d31(0x173, '*0mO')])
                  , _0x50bafc = document[_0x488d31(0x156, 'Vz9)')](_0x488d31(0x17b, '9KzK'))
                  , _0x25c947 = document['querySelector'](_0x53f87f[_0x488d31(0x14a, 'ZrEO')])
                  , _0x2c8b71 = document['querySelector'](_0x53f87f['YQHDj'])
                  , _0x592bcd = document[_0x488d31(0x259, '^Dg[')](_0x53f87f[_0x488d31(0x236, 'cZqB')])
                  , _0x5d203f = document['querySelector'](_0x53f87f['rBZPN'])
                  , _0x13263c = (document[_0x488d31(0x1cf, 'q[!)')](_0x53f87f['GaTHK']),
                    _0x53f87f[_0x488d31(0x155, 'YK1k')](_0x53f87f[_0x488d31(0x175, 'lXt%')](_0x53f87f['wqLeX'](_0x53f87f[_0x488d31(0x1c8, 'u3fp')](loaderLangText[loaderLang][_0x53f87f['vyIcp']], _0x53f87f['GpWEs']) + _0x53f87f['ooEVp'](encodeURIComponent, window[_0x488d31(0x168, 'X2]^')][_0x488d31(0x1d8, 'q02F')]), _0x53f87f[_0x488d31(0x160, 'X2]^')]), encodeURIComponent(_0x3b7113['gameName'])), _0x53f87f[_0x488d31(0x1df, 'eCDQ')]))
                  , _0x40583a = _0x53f87f[_0x488d31(0x23e, 'gXq*')](_0x53f87f[_0x488d31(0x1e0, '^Dg[')](_0x53f87f[_0x488d31(0x252, 'ZrEO')](loaderLangText[loaderLang][_0x53f87f[_0x488d31(0x1c6, 'a5*^')]] + _0x488d31(0x231, 'QdRB'), encodeURIComponent(window[_0x488d31(0x16e, 'M#[M')][_0x488d31(0x13f, '[Lj1')])) + _0x488d31(0x199, '6ARl'), encodeURIComponent(_0x3b7113[_0x488d31(0x152, '6ARl')])), '&utm_content=more_link');
                continue;
              case '3':
                var _0x599e01 = _0x53f87f[_0x488d31(0x20e, '*0mO')](_0x53f87f[_0x488d31(0x144, 'UJ5m')](_0x53f87f[_0x488d31(0x1f3, '[Lj1')], _0x3b7113['logo']), _0x53f87f[_0x488d31(0x162, '*0mO')])
                  , _0x14f65d = document['head'] || document[_0x488d31(0x24c, 'cizB')](_0x53f87f[_0x488d31(0x222, 'f&B8')])[0x0]
                  , _0x5d4fc0 = document[_0x488d31(0x221, 'UJ5m')](_0x53f87f[_0x488d31(0x193, 'M5&N')]);
                continue;
              case '4':
                _0x5a5740[_0x488d31(0x186, '@HFe')] = _0x53f87f[_0x488d31(0x229, '@HFe')](loaderLang, 'ru') ? _0x3b7113[_0x488d31(0x206, 'mk8n')] : _0x3b7113['gameNameEu'] ? _0x3b7113[_0x488d31(0x24d, 'QdRB')] : '',
                  _0x3ccc7f[_0x488d31(0x15b, '6ARl')] = _0x3b7113[_0x488d31(0x253, '3A(B')],
                  _0x3b7113[_0x488d31(0x1bd, 'f&B8')] || _0x5d203f[_0x488d31(0x200, 'X2]^')](),
                  isOnOurWeb ? (_0x592bcd[_0x488d31(0x19d, 'M#[M')](),
                    _0x25c947[_0x488d31(0x177, 'M#[M')][_0x488d31(0x178, 'YK1k')](_0x53f87f[_0x488d31(0x20c, '4Vf6')]),
                    _0x25c947[_0x488d31(0x14f, 'ZrEO')] = loaderLangText[loaderLang][_0x53f87f[_0x488d31(0x22d, '5VSB')]]) : (_0x50bafc[_0x488d31(0x22c, 'Vz9)')] = _0x13263c,
                      _0x2c8b71[_0x488d31(0x19a, 'a5*^')] = _0x40583a),
                  _0x53f87f[_0x488d31(0x1cd, 'lSm2')](loadUnityInstace, _0x3b7113[_0x488d31(0x214, '6ARl')][_0x488d31(0x23d, '5VSB')], _0x3b7113[_0x488d31(0x1e1, 'ESjW')][_0x488d31(0x17a, '6PhN')], _0x3b7113[_0x488d31(0x1cc, 'mPaR')][_0x488d31(0x14e, '@HFe')] ? _0x3b7113[_0x488d31(0x183, 'lSm2')]['callback'] : () => { }
                  );
                continue;
              case '5':
                _0xa543a3['id'] = _0x53f87f[_0x488d31(0x1a1, 'f&B8')],
                  _0xa543a3[_0x488d31(0x15d, 'cqlr')] = _0x488d31(0x204, 'Y!Xl'),
                  _0xa543a3[_0x488d31(0x235, ')ecV')] = pageCode,
                  document[_0x488d31(0x220, 'lSm2')][_0x488d31(0x1ce, 'q[!)')](_0xa543a3);
                continue;
            }
            break;
          }
        }
      }
      );
    }
  };
function loadUnityInstace(_0x53067c, _0x423c36, _0x3441c4) {
  var _0x47ff68 = decodeObfuscatedString
    , _0xfd9e1a = {
      'bneCo': _0x47ff68(0x234, 'ESjW'),
      'UGTRS': function (_0x36e428) {
        return _0x36e428();
      },
      'OXLiX': function (_0x34eef8, _0x1f66b6) {
        return _0x34eef8 === _0x1f66b6;
      },
      'ciCXw': _0x47ff68(0x181, '#kSB'),
      'ptysX': function (_0x2cffcf, _0x46c130) {
        return _0x2cffcf <= _0x46c130;
      },
      'tBmuT': function (_0x2f3cf3, _0x3548b6) {
        return _0x2f3cf3 + _0x3548b6;
      },
      'JxcIg': function (_0x5514f0, _0x173eeb) {
        return _0x5514f0 * _0x173eeb;
      },
      'AZJpL': 'fileLoadingTxt',
      'kJvxW': 'gameLoadingTxt',
      'gBLVV': function (_0x29a46a, _0x5ab0fa) {
        return _0x29a46a(_0x5ab0fa);
      },
      'GoQlA': _0x47ff68(0x1eb, '[Lj1'),
      'Ybpzf': _0x47ff68(0x1a7, 'mPaR'),
      'kemlW': _0x47ff68(0x13a, 'cizB'),
      'DSicz': _0x47ff68(0x192, '5VSB'),
      'yGMrU': 'unity-mobile',
      'Udtzw': _0x47ff68(0x18b, '9KzK'),
      'DdOSF': _0x47ff68(0x1de, '#kSB')
    };
  _0x53067c = _0x53067c;
  var _0x2c3f8f = _0x423c36
    , _0x22e24c = document['querySelector'](_0xfd9e1a[_0x47ff68(0x198, 'UJ5m')])
    , _0x2cdcac = document[_0x47ff68(0x157, 'gXq*')](_0xfd9e1a['Ybpzf'])
    , _0x2673bd = document[_0x47ff68(0x1bf, 'ESjW')](_0x47ff68(0x219, 'mk8n'))
    , _0x1c0215 = document[_0x47ff68(0x1ac, 'ZrEO')](_0x47ff68(0x212, 'ZrEO'))
    , _0x4a0e38 = document[_0x47ff68(0x197, 'mk8n')](_0xfd9e1a[_0x47ff68(0x205, '@HFe')])
    , _0x3e1553 = document[_0x47ff68(0x1e6, 'cizB')](_0xfd9e1a['DSicz']);
  /iPhone|iPad|iPod|Android/i[_0x47ff68(0x24b, 'QdRB')](navigator[_0x47ff68(0x23c, '9KzK')]) && (_0x22e24c[_0x47ff68(0x190, 'gXq*')] = _0xfd9e1a[_0x47ff68(0x22e, '6ARl')],
    _0x2c3f8f[_0x47ff68(0x1a8, 'eCDQ')] = 0x1),
    _0x2673bd[_0x47ff68(0x18c, '6PhN')][_0x47ff68(0x24f, 'cizB')] = _0xfd9e1a[_0x47ff68(0x1d6, '@HFe')];
  var _0x38faa0 = document[_0x47ff68(0x16f, 'X2]^')](_0xfd9e1a[_0x47ff68(0x1ad, 'eCDQ')]);
  _0x38faa0[_0x47ff68(0x1b8, '9Yz&')] = _0x53067c,
    _0x38faa0[_0x47ff68(0x1d9, '6ARl')] = () => {
      var _0x2dd4ed = _0x47ff68
        , _0x53f9cd = {
          'TCIUo': _0xfd9e1a[_0x2dd4ed(0x1d1, 'mPaR')],
          'DPfiz': function (_0x266f11) {
            var _0x3c44a6 = _0x2dd4ed;
            return _0xfd9e1a[_0x3c44a6(0x149, 'wOfw')](_0x266f11);
          },
          'PAKPu': function (_0x1eaba3, _0x4ed6a4) {
            return _0xfd9e1a['OXLiX'](_0x1eaba3, _0x4ed6a4);
          },
          'UsnwS': _0xfd9e1a[_0x2dd4ed(0x1e5, 'a5*^')],
          'tmLuL': function (_0x3ae45d, _0x341095) {
            var _0x1db829 = _0x2dd4ed;
            return _0xfd9e1a[_0x1db829(0x1b3, 'gXq*')](_0x3ae45d, _0x341095);
          },
          'jmJMI': function (_0xe444d0, _0x4de14e) {
            var _0x6e1d4f = _0x2dd4ed;
            return _0xfd9e1a[_0x6e1d4f(0x16b, 'eCDQ')](_0xe444d0, _0x4de14e);
          },
          'zaXnu': function (_0x423c93, _0x551ac2) {
            return _0xfd9e1a['JxcIg'](_0x423c93, _0x551ac2);
          },
          'RxTzj': function (_0x2c7025, _0x156d42) {
            return _0x2c7025 + _0x156d42;
          },
          'RTqqT': _0xfd9e1a[_0x2dd4ed(0x224, 'kNPe')],
          'JSeZc': _0xfd9e1a[_0x2dd4ed(0x218, 'nmrv')],
          'cuuSC': function (_0x20b377, _0x48ec27) {
            var _0xd39665 = _0x2dd4ed;
            return _0xfd9e1a[_0xd39665(0x17c, 'u3fp')](_0x20b377, _0x48ec27);
          }
        };
      createUnityInstance(_0x2cdcac, _0x2c3f8f, _0x55634f => {
        var _0x1a03c7 = _0x2dd4ed
          , _0x534e39 = {
            'dHTtQ': _0x53f9cd[_0x1a03c7(0x249, 'M5&N')],
            'kKejR': function (_0x8598f7) {
              var _0x205e46 = _0x1a03c7;
              return _0x53f9cd[_0x205e46(0x165, 'Y!Xl')](_0x8598f7);
            }
          };
        _0x53f9cd[_0x1a03c7(0x207, '9KzK')](_0x1a03c7(0x1f0, 'YK1k'), _0x53f9cd['UsnwS']) ? (_0x287c96[_0x1a03c7(0x20b, 'mrZI')] = _0x5b33d6,
          _0x558db7[_0x1a03c7(0x1ef, 'RI*2')] = _0x16349d[_0x1a03c7(0x164, 'eCDQ')][_0x1a03c7(0x189, 'nmrv')],
          _0x2bd4c7[_0x1a03c7(0x209, 'Vz9)')]['display'] = _0x534e39[_0x1a03c7(0x20f, '5VSB')],
          _0x20346f && (_0x15af40[_0x1a03c7(0x145, 'YK1k')] = () => {
            _0xb3c060['SetFullscreen'](0x1);
          }
          ),
          _0x37a442 && _0x534e39['kKejR'](_0x2f47ba)) : _0x53f9cd['tmLuL'](_0x55634f, 0.89) ? (_0x1c0215[_0x1a03c7(0x1c5, 'mrZI')][_0x1a03c7(0x15a, 'ESjW')] = _0x53f9cd[_0x1a03c7(0x245, '@HFe')](_0x53f9cd['zaXnu'](0x64, _0x55634f), '%'),
            _0x4a0e38[_0x1a03c7(0x1ed, 'q02F')] = _0x53f9cd[_0x1a03c7(0x1db, '3A(B')](loaderLangText[loaderLang][_0x53f9cd[_0x1a03c7(0x223, 'cizB')]], Math[_0x1a03c7(0x146, 'Efo%')](0x64 * _0x55634f)) + '%') : (_0x1c0215[_0x1a03c7(0x1fd, '9Yz&')]['width'] = _0x1a03c7(0x24e, 'lSm2'),
              _0x4a0e38['innerHTML'] = loaderLangText[loaderLang][_0x53f9cd[_0x1a03c7(0x147, '1Pms')]]);
      }
      )[_0x2dd4ed(0x1dd, 'ZrEO')](_0x4172d5 => {
        var _0x5071d7 = _0x2dd4ed;
        window[_0x5071d7(0x15c, 'cqlr')] = _0x4172d5,
          window['unityStringify'] = _0x4172d5[_0x5071d7(0x148, 'gXq*')][_0x5071d7(0x1c1, 'f&B8')],
          _0x2673bd[_0x5071d7(0x182, 'mPaR')][_0x5071d7(0x143, 'mrZI')] = _0xfd9e1a['bneCo'],
          _0x3e1553 && (_0x3e1553[_0x5071d7(0x13e, 'wOfw')] = () => {
            var _0x5e71c5 = _0x5071d7;
            _0x4172d5[_0x5e71c5(0x16a, 'a5*^')](0x1);
          }
          );
        _0x3441c4 && _0x3441c4();
      }
      )['catch'](_0x3107ce => {
        var _0xd2ad79 = _0x2dd4ed;
        _0x53f9cd[_0xd2ad79(0x1bc, 'Y!Xl')](alert, _0x3107ce);
      }
      );
    }
    ,
    document[_0x47ff68(0x1a9, 'Y!Xl')][_0x47ff68(0x174, '^Dg[')](_0x38faa0);
}
var version_ = 'jsjiami.com.v7';