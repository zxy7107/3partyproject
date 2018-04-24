'use strict';

window.onload = function () {
  var svgMorpheus = new SVGMorpheus('#icon'),
      svgIcon     = document.getElementById('icon'),
      selIcon     = document.getElementById('selIcon'),
      selEasing   = document.getElementById('selEasing'),
      selDuration = document.getElementById('selDuration'),
      selRotation = document.getElementById('selRotation'),
      icons={
        '3d_rotation':'3D Rotation',
        'accessibility':'Accessibility',
        'account_balance':'Account Balance',
        'account_box':'Account Box',
        'account_circle':'Account Circle',
        'add_shopping_cart':'Add Shopping Cart',
        'android':'Android',
        'backup':'Backup',
        'bookmark':'Bookmark',
        'bug_report':'Bug Report',
        'credit_card':'Credit Card',
        'delete':'Delete',
        'done':'Done',
        'drawer':'Drawer',
        'event':'Event',
        'exit_to_app':'Exit To App',
        'explore':'Explore',
        'extension':'Extension',
        'favorite':'Favorite',
        'help':'Help',
        'history':'History',
        'home':'Home',
        'https':'Https',
        'info':'Info',
        'input':'Input',
        'invert_colors':'Invert Colors',
        'label':'Label',
        'language':'Language',
        'launch':'Launch',
        'loyalty':'Loyalty',
        'polymer':'Polymer',
        'print':'Print',
        'receipt':'Receipt'
      },
      easings={
        'circ-in': 'Circ In','circ-out': 'Circ Out','circ-in-out': 'Circ In/Out',
        'cubic-in': 'Cubic In', 'cubic-out': 'Cubic Out', 'cubic-in-out': 'Cubic In/Out',
        'elastic-in': 'Elastic In', 'elastic-out': 'Elastic Out', 'elastic-in-out': 'Elastic In/Out',
        'expo-in': 'Expo In', 'expo-out': 'Expo Out', 'expo-in-out': 'Expo In/Out',
        'linear': 'Linear',
        'quad-in': 'Quad In', 'quad-out': 'Quad Out', 'quad-in-out': 'Quad In/Out',
        'quart-in': 'Quart In', 'quart-out': 'Quart Out', 'quart-in-out': 'Quart In/Out',
        'quint-in': 'Quint In', 'quint-out': 'Quint Out', 'quint-in-out': 'Quint In/Out',
        'sine-in': 'Sine In','sine-out': 'Sine Out','sine-in-out': 'Sine In/Out'
      },
      durations=[250, 500, 750, 1000, 5000],
      rotations={
        'clock': 'Clockwise',
        'counterclock': 'Counterclockwise',
        'random': 'Random',
        'none': 'None'
      };

  function onIconChange() {
    var valIcon='done',
        valEasing='quad-in-out',
        valDuration='750',
        valRotation='clock';
    svgMorpheus.to(valIcon, {duration: valDuration, easing: valEasing, rotation: valRotation},null);
  }

    svgIcon.addEventListener('click', onIconChange)

};