import React, { useState, useEffect } from 'react';

// מאגר כל 36 מחזורי הליגה המלאים (26 ליגה סדירה + 10 מחזורי פלייאוף)
const allFixtures = {
  1: [
    { id: 1, home: 'מכבי פ"ת', away: 'הפועל ק"ש', time: '22/08/26' },
    { id: 2, home: 'עירוני דורות טבריה', away: 'הפועל פ"ת', time: '22/08/26' },
    { id: 3, home: 'הפועל י-ם', away: 'מכבי ת"א', time: '22/08/26' },
    { id: 4, home: 'מכבי חיפה', away: 'הפועל ר"ג', time: '22/08/26' },
    { id: 5, home: 'הפועל ב"ש', away: 'הפועל חיפה', time: '22/08/26' },
    { id: 6, home: 'בית"ר י-ם', away: 'הפועל ת"א', time: '22/08/26' },
    { id: 7, home: 'מכבי נתניה', away: 'בני סכנין', time: '22/08/26' }
  ],
  2: [
    { id: 1, home: 'בני סכנין', away: 'מכבי פ"ת', time: '29/08/26' },
    { id: 2, home: 'מכבי נתניה', away: 'הפועל י-ם', time: '29/08/26' },
    { id: 3, home: 'הפועל ת"א', away: 'מכבי חיפה', time: '29/08/26' },
    { id: 4, home: 'הפועל ב"ש', away: 'הפועל ר"ג', time: '29/08/26' },
    { id: 5, home: 'מכבי חיפה', away: 'מכבי ת"א', time: '29/08/26' },
    { id: 6, home: 'הפועל פ"ת', away: 'בית"ר י-ם', time: '29/08/26' },
    { id: 7, home: 'עירוני דורות טבריה', away: 'הפועל ק"ש', time: '29/08/26' }
  ],
  3: [
    { id: 1, home: 'מכבי פ"ת', away: 'עירוני דורות טבריה', time: '05/09/26' },
    { id: 2, home: 'הפועל ק"ש', away: 'הפועל י-ם', time: '05/09/26' },
    { id: 3, home: 'הפועל פ"ת', away: 'מכבי חיפה', time: '05/09/26' },
    { id: 4, home: 'מכבי ת"א', away: 'הפועל ב"ש', time: '05/09/26' },
    { id: 5, home: 'הפועל ר"ג', away: 'הפועל ת"א', time: '05/09/26' },
    { id: 6, home: 'הפועל חיפה', away: 'מכבי נתניה', time: '05/09/26' },
    { id: 7, home: 'בית"ר י-ם', away: 'בני סכנין', time: '05/09/26' }
  ],
  4: [
    { id: 1, home: 'בית"ר י-ם', away: 'מכבי פ"ת', time: '14/09/26' },
    { id: 2, home: 'בני סכנין', away: 'הפועל חיפה', time: '14/09/26' },
    { id: 3, home: 'מכבי נתניה', away: 'הפועל ר"ג', time: '14/09/26' },
    { id: 4, home: 'הפועל ת"א', away: 'מכבי ת"א', time: '14/09/26' },
    { id: 5, home: 'הפועל ב"ש', away: 'הפועל פ"ת', time: '14/09/26' },
    { id: 6, home: 'מכבי חיפה', away: 'הפועל ק"ש', time: '14/09/26' },
    { id: 7, home: 'הפועל י-ם', away: 'עירוני דורות טבריה', time: '14/09/26' }
  ],
  5: [
    { id: 1, home: 'מכבי פ"ת', away: 'הפועל י-ם', time: '19/09/26' },
    { id: 2, home: 'מכבי חיפה', away: 'עירוני דורות טבריה', time: '19/09/26' },
    { id: 3, home: 'הפועל ב"ש', away: 'הפועל ק"ש', time: '19/09/26' },
    { id: 4, home: 'הפועל ת"א', away: 'הפועל פ"ת', time: '19/09/26' },
    { id: 5, home: 'מכבי נתניה', away: 'מכבי ת"א', time: '19/09/26' },
    { id: 6, home: 'בני סכנין', away: 'הפועל ר"ג', time: '19/09/26' },
    { id: 7, home: 'בית"ר י-ם', away: 'הפועל חיפה', time: '19/09/26' }
  ],
  6: [
    { id: 1, home: 'הפועל חיפה', away: 'מכבי פ"ת', time: '10/10/26' },
    { id: 2, home: 'הפועל ר"ג', away: 'בית"ר י-ם', time: '10/10/26' },
    { id: 3, home: 'מכבי ת"א', away: 'בני סכנין', time: '10/10/26' },
    { id: 4, home: 'הפועל פ"ת', away: 'מכבי נתניה', time: '10/10/26' },
    { id: 5, home: 'הפועל ק"ש', away: 'הפועל ת"א', time: '10/10/26' },
    { id: 6, home: 'עירוני דורות טבריה', away: 'הפועל ב"ש', time: '10/10/26' },
    { id: 7, home: 'הפועל י-ם', away: 'מכבי חיפה', time: '10/10/26' }
  ],
  7: [
    { id: 1, home: 'מכבי פ"ת', away: 'מכבי חיפה', time: '17/10/26' },
    { id: 2, home: 'הפועל ב"ש', away: 'הפועל י-ם', time: '17/10/26' },
    { id: 3, home: 'הפועל ת"א', away: 'עירוני דורות טבריה', time: '17/10/26' },
    { id: 4, home: 'מכבי נתניה', away: 'הפועל ק"ש', time: '17/10/26' },
    { id: 5, home: 'בני סכנין', away: 'הפועל פ"ת', time: '17/10/26' },
    { id: 6, home: 'בית"ר י-ם', away: 'מכבי ת"א', time: '17/10/26' },
    { id: 7, home: 'הפועל חיפה', away: 'הפועל ר"ג', time: '17/10/26' }
  ],
  8: [
    { id: 1, home: 'הפועל ר"ג', away: 'מכבי פ"ת', time: '24/10/26' },
    { id: 2, home: 'מכבי ת"א', away: 'הפועל חיפה', time: '24/10/26' },
    { id: 3, home: 'הפועל פ"ת', away: 'בית"ר י-ם', time: '24/10/26' },
    { id: 4, home: 'הפועל ק"ש', away: 'בני סכנין', time: '24/10/26' },
    { id: 5, home: 'עירוני דורות טבריה', away: 'מכבי נתניה', time: '24/10/26' },
    { id: 6, home: 'הפועל י-ם', away: 'הפועל ת"א', time: '24/10/26' },
    { id: 7, home: 'מכבי חיפה', away: 'הפועל ב"ש', time: '24/10/26' }
  ],
  9: [
    { id: 1, home: 'מכבי פ"ת', away: 'הפועל ב"ש', time: '31/10/26' },
    { id: 2, home: 'הפועל ת"א', away: 'מכבי חיפה', time: '31/10/26' },
    { id: 3, home: 'מכבי נתניה', away: 'הפועל י-ם', time: '31/10/26' },
    { id: 4, home: 'בני סכנין', away: 'עירוני דורות טבריה', time: '31/10/26' },
    { id: 5, home: 'בית"ר י-ם', away: 'הפועל ק"ש', time: '31/10/26' },
    { id: 6, home: 'הפועל חיפה', away: 'הפועל פ"ת', time: '31/10/26' },
    { id: 7, home: 'הפועל ר"ג', away: 'מכבי ת"א', time: '31/10/26' }
  ],
  10: [
    { id: 1, home: 'מכבי ת"א', away: 'מכבי פ"ת', time: '07/11/26' },
    { id: 2, home: 'הפועל פ"ת', away: 'הפועל ר"ג', time: '07/11/26' },
    { id: 3, home: 'הפועל ק"ש', away: 'הפועל חיפה', time: '07/11/26' },
    { id: 4, home: 'עירוני דורות טבריה', away: 'בית"ר י-ם', time: '07/11/26' },
    { id: 5, home: 'הפועל י-ם', away: 'בני סכנין', time: '07/11/26' },
    { id: 6, home: 'מכבי חיפה', away: 'מכבי נתניה', time: '07/11/26' },
    { id: 7, home: 'הפועל ב"ש', away: 'הפועל ת"א', time: '07/11/26' }
  ],
  11: [
    { id: 1, home: 'מכבי פ"ת', away: 'הפועל ת"א', time: '28/11/26' },
    { id: 2, home: 'מכבי נתניה', away: 'הפועל ב"ש', time: '28/11/26' },
    { id: 3, home: 'בני סכנין', away: 'מכבי חיפה', time: '28/11/26' },
    { id: 4, home: 'בית"ר י-ם', away: 'הפועל י-ם', time: '28/11/26' },
    { id: 5, home: 'הפועל חיפה', away: 'עירוני דורות טבריה', time: '28/11/26' },
    { id: 6, home: 'הפועל ר"ג', away: 'הפועל ק"ש', time: '28/11/26' },
    { id: 7, home: 'מכבי ת"א', away: 'הפועל פ"ת', time: '28/11/26' }
  ],
  12: [
    { id: 1, home: 'מכבי פ"ת', away: 'הפועל פ"ת', time: '01/12/26' },
    { id: 2, home: 'הפועל ק"ש', away: 'מכבי ת"א', time: '01/12/26' },
    { id: 3, home: 'עירוני דורות טבריה', away: 'הפועל ר"ג', time: '01/12/26' },
    { id: 4, home: 'הפועל י-ם', away: 'הפועל חיפה', time: '01/12/26' },
    { id: 5, home: 'בית"ר י-ם', away: 'מכבי חיפה', time: '01/12/26' },
    { id: 6, home: 'בני סכנין', away: 'הפועל ב"ש', time: '01/12/26' },
    { id: 7, home: 'מכבי נתניה', away: 'הפועל ת"א', time: '01/12/26' }
  ],
  13: [
    { id: 1, home: 'מכבי נתניה', away: 'מכבי פ"ת', time: '05/12/26' },
    { id: 2, home: 'בני סכנין', away: 'הפועל ת"א', time: '05/12/26' },
    { id: 3, home: 'בית"ר י-ם', away: 'הפועל ב"ש', time: '05/12/26' },
    { id: 4, home: 'הפועל חיפה', away: 'מכבי חיפה', time: '05/12/26' },
    { id: 5, home: 'הפועל ר"ג', away: 'הפועל י-ם', time: '05/12/26' },
    { id: 6, home: 'מכבי ת"א', away: 'עירוני דורות טבריה', time: '05/12/26' },
    { id: 7, home: 'הפועל פ"ת', away: 'הפועל ק"ש', time: '05/12/26' }
  ],
  14: [
    { id: 1, home: 'הפועל ק"ש', away: 'מכבי פ"ת', time: '12/12/26' },
    { id: 2, home: 'הפועל פ"ת', away: 'עירוני דורות טבריה', time: '12/12/26' },
    { id: 3, home: 'מכבי ת"א', away: 'הפועל י-ם', time: '12/12/26' },
    { id: 4, home: 'הפועל ר"ג', away: 'מכבי חיפה', time: '12/12/26' },
    { id: 5, home: 'הפועל חיפה', away: 'הפועל ב"ש', time: '12/12/26' },
    { id: 6, home: 'בית"ר י-ם', away: 'הפועל ת"א', time: '12/12/26' },
    { id: 7, home: 'בני סכנין', away: 'מכבי נתניה', time: '12/12/26' }
  ],
  15: [
    { id: 1, home: 'מכבי פ"ת', away: 'בני סכנין', time: '19/12/26' },
    { id: 2, home: 'מכבי נתניה', away: 'בית"ר י-ם', time: '19/12/26' },
    { id: 3, home: 'הפועל ת"א', away: 'הפועל חיפה', time: '19/12/26' },
    { id: 4, home: 'הפועל ב"ש', away: 'הפועל ר"ג', time: '19/12/26' },
    { id: 5, home: 'מכבי חיפה', away: 'מכבי ת"א', time: '19/12/26' },
    { id: 6, home: 'הפועל י-ם', away: 'הפועל פ"ת', time: '19/12/26' },
    { id: 7, home: 'עירוני דורות טבריה', away: 'הפועל ק"ש', time: '19/12/26' }
  ],
  16: [
    { id: 1, home: 'עירוני דורות טבריה', away: 'מכבי פ"ת', time: '29/12/26' },
    { id: 2, home: 'הפועל ק"ש', away: 'הפועל י-ם', time: '29/12/26' },
    { id: 3, home: 'הפועל פ"ת', away: 'מכבי חיפה', time: '29/12/26' },
    { id: 4, home: 'מכבי ת"א', away: 'הפועל ב"ש', time: '29/12/26' },
    { id: 5, home: 'הפועל ר"ג', away: 'הפועל ת"א', time: '29/12/26' },
    { id: 6, home: 'הפועל חיפה', away: 'מכבי נתניה', time: '29/12/26' },
    { id: 7, home: 'בית"ר י-ם', away: 'בני סכנין', time: '29/12/26' }
  ],
  17: [
    { id: 1, home: 'מכבי פ"ת', away: 'בית"ר י-ם', time: '02/01/27' },
    { id: 2, home: 'בני סכנין', away: 'הפועל חיפה', time: '02/01/27' },
    { id: 3, home: 'מכבי נתניה', away: 'הפועל ר"ג', time: '02/01/27' },
    { id: 4, home: 'הפועל ת"א', away: 'מכבי ת"א', time: '02/01/27' },
    { id: 5, home: 'הפועל ב"ש', away: 'הפועל פ"ת', time: '02/01/27' },
    { id: 6, home: 'מכבי חיפה', away: 'הפועל ק"ש', time: '02/01/27' },
    { id: 7, home: 'הפועל י-ם', away: 'עירוני דורות טבריה', time: '02/01/27' }
  ],
  18: [
    { id: 1, home: 'הפועל י-ם', away: 'מכבי פ"ת', time: '09/01/27' },
    { id: 2, home: 'עירוני דורות טבריה', away: 'מכבי חיפה', time: '09/01/27' },
    { id: 3, home: 'הפועל ק"ש', away: 'הפועל ב"ש', time: '09/01/27' },
    { id: 4, home: 'הפועל פ"ת', away: 'הפועל ת"א', time: '09/01/27' },
    { id: 5, home: 'מכבי ת"א', away: 'מכבי נתניה', time: '09/01/27' },
    { id: 6, home: 'הפועל ר"ג', away: 'בני סכנין', time: '09/01/27' },
    { id: 7, home: 'בית"ר י-ם', away: 'הפועל חיפה', time: '09/01/27' }
  ],
  19: [
    { id: 1, home: 'מכבי פ"ת', away: 'הפועל חיפה', time: '16/01/27' },
    { id: 2, home: 'בית"ר י-ם', away: 'הפועל ר"ג', time: '16/01/27' },
    { id: 3, home: 'בני סכנין', away: 'מכבי ת"א', time: '16/01/27' },
    { id: 4, home: 'מכבי נתניה', away: 'הפועל פ"ת', time: '16/01/27' },
    { id: 5, home: 'הפועל ת"א', away: 'הפועל ק"ש', time: '16/01/27' },
    { id: 6, home: 'הפועל ב"ש', away: 'עירוני דורות טבריה', time: '16/01/27' },
    { id: 7, home: 'הפועל י-ם', away: 'מכבי חיפה', time: '16/01/27' }
  ],
  20: [
    { id: 1, home: 'מכבי חיפה', away: 'מכבי פ"ת', time: '23/01/27' },
    { id: 2, home: 'הפועל י-ם', away: 'הפועל ב"ש', time: '23/01/27' },
    { id: 3, home: 'עירוני דורות טבריה', away: 'הפועל ת"א', time: '23/01/27' },
    { id: 4, home: 'הפועל ק"ש', away: 'מכבי נתניה', time: '23/01/27' },
    { id: 5, home: 'הפועל פ"ת', away: 'בני סכנין', time: '23/01/27' },
    { id: 6, home: 'בית"ר י-ם', away: 'מכבי ת"א', time: '23/01/27' },
    { id: 7, home: 'הפועל חיפה', away: 'הפועל ר"ג', time: '23/01/27' }
  ],
  21: [
    { id: 1, home: 'מכבי פ"ת', away: 'הפועל ר"ג', time: '30/01/27' },
    { id: 2, home: 'הפועל חיפה', away: 'מכבי ת"א', time: '30/01/27' },
    { id: 3, home: 'בית"ר י-ם', away: 'הפועל פ"ת', time: '30/01/27' },
    { id: 4, home: 'בני סכנין', away: 'הפועל ק"ש', time: '30/01/27' },
    { id: 5, home: 'מכבי נתניה', away: 'עירוני דורות טבריה', time: '30/01/27' },
    { id: 6, home: 'הפועל ת"א', away: 'הפועל י-ם', time: '30/01/27' },
    { id: 7, home: 'הפועל ב"ש', away: 'מכבי חיפה', time: '30/01/27' }
  ],
  22: [
    { id: 1, home: 'הפועל ב"ש', away: 'מכבי פ"ת', time: '06/02/27' },
    { id: 2, home: 'מכבי חיפה', away: 'הפועל ת"א', time: '06/02/27' },
    { id: 3, home: 'הפועל י-ם', away: 'מכבי נתניה', time: '06/02/27' },
    { id: 4, home: 'עירוני דורות טבריה', away: 'בני סכנין', time: '06/02/27' },
    { id: 5, home: 'הפועל ק"ש', away: 'בית"ר י-ם', time: '06/02/27' },
    { id: 6, home: 'הפועל פ"ת', away: 'הפועל חיפה', time: '06/02/27' },
    { id: 7, home: 'מכבי ת"א', away: 'הפועל ר"ג', time: '06/02/27' }
  ],
  23: [
    { id: 1, home: 'מכבי פ"ת', away: 'מכבי ת"א', time: '13/02/27' },
    { id: 2, home: 'הפועל ר"ג', away: 'הפועל פ"ת', time: '13/02/27' },
    { id: 3, home: 'הפועל חיפה', away: 'הפועל ק"ש', time: '13/02/27' },
    { id: 4, home: 'בית"ר י-ם', away: 'עירוני דורות טבריה', time: '13/02/27' },
    { id: 5, home: 'בני סכנין', away: 'הפועל י-ם', time: '13/02/27' },
    { id: 6, home: 'מכבי נתניה', away: 'מכבי חיפה', time: '13/02/27' },
    { id: 7, home: 'הפועל ת"א', away: 'הפועל ב"ש', time: '13/02/27' }
  ],
  24: [
    { id: 1, home: 'הפועל ת"א', away: 'מכבי פ"ת', time: '20/02/27' },
    { id: 2, home: 'הפועל ב"ש', away: 'מכבי נתניה', time: '20/02/27' },
    { id: 3, home: 'מכבי חיפה', away: 'בני סכנין', time: '20/02/27' },
    { id: 4, home: 'הפועל י-ם', away: 'בית"ר י-ם', time: '20/02/27' },
    { id: 5, home: 'עירוני דורות טבריה', away: 'הפועל חיפה', time: '20/02/27' },
    { id: 6, home: 'הפועל ק"ש', away: 'הפועל ר"ג', time: '20/02/27' },
    { id: 7, home: 'מכבי ת"א', away: 'הפועל פ"ת', time: '20/02/27' }
  ],
  25: [
    { id: 1, home: 'הפועל פ"ת', away: 'מכבי פ"ת', time: '27/02/27' },
    { id: 2, home: 'מכבי ת"א', away: 'הפועל ק"ש', time: '27/02/27' },
    { id: 3, home: 'הפועל ר"ג', away: 'עירוני דורות טבריה', time: '27/02/27' },
    { id: 4, home: 'הפועל חיפה', away: 'הפועל י-ם', time: '27/02/27' },
    { id: 5, home: 'בית"ר י-ם', away: 'מכבי חיפה', time: '27/02/27' },
    { id: 6, home: 'בני סכנין', away: 'הפועל ב"ש', time: '27/02/27' },
    { id: 7, home: 'מכבי נתניה', away: 'הפועל ת"א', time: '27/02/27' }
  ],
  26: [
    { id: 1, home: 'מכבי נתניה', away: 'מכבי פ"ת', time: '06/03/27' },
    { id: 2, home: 'בני סכנין', away: 'הפועל ת"א', time: '06/03/27' },
    { id: 3, home: 'בית"ר י-ם', away: 'הפועל ב"ש', time: '06/03/27' },
    { id: 4, home: 'הפועל חיפה', away: 'מכבי חיפה', time: '06/03/27' },
    { id: 5, home: 'הפועל ר"ג', away: 'הפועל י-ם', time: '06/03/27' },
    { id: 6, home: 'מכבי ת"א', away: 'עירוני דורות טבריה', time: '06/03/27' },
    { id: 7, home: 'הפועל פ"ת', away: 'הפועל ק"ש', time: '06/03/27' }
  ],
  27: [
    { id: 1, home: 'מקום 1', away: 'מקום 6', time: '13/03/27' },
    { id: 2, home: 'מקום 2', away: 'מקום 5', time: '13/03/27' },
    { id: 3, home: 'מקום 3', away: 'מקום 4', time: '13/03/27' },
    { id: 4, home: 'מקום 7', away: 'מקום 11', time: '13/03/27' },
    { id: 5, home: 'מקום 8', away: 'מקום 13', time: '13/03/27' },
    { id: 6, home: 'מקום 9', away: 'מקום 12', time: '13/03/27' },
    { id: 7, home: 'מקום 10', away: 'מקום 14', time: '13/03/27' }
  ],
  28: [
    { id: 1, home: 'מקום 6', away: 'מקום 4', time: '20/03/27' },
    { id: 2, home: 'מקום 5', away: 'מקום 3', time: '20/03/27' },
    { id: 3, home: 'מקום 1', away: 'מקום 2', time: '20/03/27' },
    { id: 4, home: 'מקום 11', away: 'מקום 14', time: '20/03/27' },
    { id: 5, home: 'מקום 12', away: 'מקום 10', time: '20/03/27' },
    { id: 6, home: 'מקום 13', away: 'מקום 9', time: '20/03/27' },
    { id: 7, home: 'מקום 7', away: 'מקום 8', time: '20/03/27' }
  ],
  29: [
    { id: 1, home: 'מקום 2', away: 'מקום 6', time: '03/04/27' },
    { id: 2, home: 'מקום 3', away: 'מקום 1', time: '03/04/27' },
    { id: 3, home: 'מקום 4', away: 'מקום 5', time: '03/04/27' },
    { id: 4, home: 'מקום 8', away: 'מקום 11', time: '03/04/27' },
    { id: 5, home: 'מקום 9', away: 'מקום 7', time: '03/04/27' },
    { id: 6, home: 'מקום 10', away: 'מקום 13', time: '03/04/27' },
    { id: 7, home: 'מקום 14', away: 'מקום 12', time: '03/04/27' }
  ],
  30: [
    { id: 1, home: 'מקום 6', away: 'מקום 5', time: '10/04/27' },
    { id: 2, home: 'מקום 1', away: 'מקום 4', time: '10/04/27' },
    { id: 3, home: 'מקום 2', away: 'מקום 3', time: '10/04/27' },
    { id: 4, home: 'מקום 11', away: 'מקום 12', time: '10/04/27' },
    { id: 5, home: 'מקום 13', away: 'מקום 14', time: '10/04/27' },
    { id: 6, home: 'מקום 7', away: 'מקום 10', time: '10/04/27' },
    { id: 7, home: 'מקום 8', away: 'מקום 9', time: '10/04/27' }
  ],
  31: [
    { id: 1, home: 'מקום 3', away: 'מקום 6', time: '17/04/27' },
    { id: 2, home: 'מקום 4', away: 'מקום 2', time: '17/04/27' },
    { id: 3, home: 'מקום 5', away: 'מקום 1', time: '17/04/27' },
    { id: 4, home: 'מקום 9', away: 'מקום 11', time: '17/04/27' },
    { id: 5, home: 'מקום 10', away: 'מקום 8', time: '17/04/27' },
    { id: 6, home: 'מקום 14', away: 'מקום 7', time: '17/04/27' },
    { id: 7, home: 'מקום 12', away: 'מקום 13', time: '17/04/27' }
  ],
  32: [
    { id: 1, home: 'מקום 6', away: 'מקום 1', time: '24/04/27' },
    { id: 2, home: 'מקום 5', away: 'מקום 2', time: '24/04/27' },
    { id: 3, home: 'מקום 4', away: 'מקום 3', time: '24/04/27' },
    { id: 4, home: 'מקום 11', away: 'מקום 13', time: '24/04/27' },
    { id: 5, home: 'מקום 7', away: 'מקום 12', time: '24/04/27' },
    { id: 6, home: 'מקום 8', away: 'מקום 14', time: '24/04/27' },
    { id: 7, home: 'מקום 9', away: 'מקום 10', time: '24/04/27' }
  ],
  33: [
    { id: 1, home: 'מקום 4', away: 'מקום 6', time: '01/05/27' },
    { id: 2, home: 'מקום 3', away: 'מקום 5', time: '01/05/27' },
    { id: 3, home: 'מקום 2', away: 'מקום 1', time: '01/05/27' },
    { id: 4, home: 'מקום 10', away: 'מקום 11', time: '01/05/27' },
    { id: 5, home: 'מקום 14', away: 'מקום 9', time: '01/05/27' },
    { id: 6, home: 'מקום 12', away: 'מקום 8', time: '01/05/27' },
    { id: 7, home: 'מקום 13', away: 'מקום 7', time: '01/05/27' }
  ],
  34: [
    { id: 1, home: 'מקום 6', away: 'מקום 2', time: '08/05/27' },
    { id: 2, home: 'מקום 1', away: 'מקום 3', time: '08/05/27' },
    { id: 3, home: 'מקום 5', away: 'מקום 4', time: '08/05/27' }
  ],
  35: [
    { id: 1, home: 'מקום 5', away: 'מקום 6', time: '15/05/27' },
    { id: 2, home: 'מקום 4', away: 'מקום 1', time: '15/05/27' },
    { id: 3, home: 'מקום 3', away: 'מקום 2', time: '15/05/27' }
  ],
  36: [
    { id: 1, home: 'מקום 6', away: 'מקום 3', time: '22/05/27' },
    { id: 2, home: 'מקום 2', away: 'מקום 4', time: '22/05/27' },
    { id: 3, home: 'מקום 1', away: 'מקום 5', time: '22/05/27' }
  ]
};

const ISRAELI_TEAMS = ['מכבי ת"א', 'מכבי חיפה', 'בית"ר י-ם', 'הפועל ב"ש', 'הפועל ת"א', 'מכבי נתניה', 'הפועל חיפה', 'מכבי פ"ת', 'בני סכנין', 'עירוני דורות טבריה', 'הפועל ק"ש', 'הפועל פ"ת', 'הפועל ר"ג', 'הפועל י-ם'];

const TEAM_META = {
  'מכבי ת"א': { badge: '🟡', color: 'from-yellow-500/25 to-blue-500/10' },
  'מכבי חיפה': { badge: '🟢', color: 'from-emerald-500/25 to-green-900/20' },
  'בית"ר י-ם': { badge: '🟡', color: 'from-yellow-500/25 to-black/20' },
  'הפועל ב"ש': { badge: '🔴', color: 'from-red-500/25 to-red-950/20' },
  'הפועל ת"א': { badge: '🔴', color: 'from-red-500/25 to-gray-950/20' },
  'מכבי נתניה': { badge: '🟡', color: 'from-yellow-400/20 to-gray-950/20' },
  'הפועל חיפה': { badge: '🔴', color: 'from-red-500/20 to-blue-500/10' },
  'מכבי פ"ת': { badge: '🔵', color: 'from-blue-500/20 to-gray-950/20' },
  'בני סכנין': { badge: '🔴', color: 'from-red-600/20 to-gray-950/20' },
  'עירוני דורות טבריה': { badge: '🔵', color: 'from-sky-500/20 to-gray-950/20' },
  'הפועל ק"ש': { badge: '🔵', color: 'from-blue-500/20 to-gray-950/20' },
  'הפועל פ"ת': { badge: '🔵', color: 'from-blue-500/20 to-gray-950/20' },
  'הפועל ר"ג': { badge: '🔴', color: 'from-red-500/20 to-gray-950/20' },
  'הפועל י-ם': { badge: '🔴', color: 'from-red-500/20 to-black/20' }
};

const FRIENDS = [
  { name: 'משתתף 1', icon: '👑', role: 'מוביל הטבלה', vibe: 'מחפש בולים' },
  { name: 'משתתף 2', icon: '⚽', role: 'מנתח משחקים', vibe: 'חזק בכיוונים' },
  { name: 'משתתף 3', icon: '🎯', role: 'אוהב תיקו', vibe: 'X בזמן הנכון' },
  { name: 'משתתף 4', icon: '🔥', role: 'הולך על הפתעות', vibe: 'לא מפחד מסיכון' },
  { name: 'משתתף 5', icon: '🧠', role: 'מומחה מחזורים', vibe: 'תמיד עם אסטרטגיה' },
  { name: 'משתתף 6', icon: '🦊', role: 'שועל ותיק', vibe: 'מזהה הפתעות' },
  { name: 'משתתף 7', icon: '🚀', role: 'טיפוס מהיר', vibe: 'מחפש רצף' },
  { name: 'משתתף 8', icon: '🧤', role: 'הגנתי', vibe: 'תוצאות נמוכות' },
  { name: 'משתתף 9', icon: '💎', role: 'בוליסט', vibe: 'מכוון מדויק' },
  { name: 'משתתף 10', icon: '🏁', role: 'פינישר', vibe: 'חזק בסיום' }
];

const getTeamBadge = (team) => TEAM_META[team]?.badge || '⚽';
const getTeamGradient = (team) => TEAM_META[team]?.color || 'from-gray-800 to-gray-950';

// פונקציות עזר גלובליות קבועות מחוץ לרכיב
const getGameLockDeadline = (dateStr) => {
  if (!dateStr || dateStr === 'יעודכן בהמשך') return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = 2000 + parseInt(parts[2], 10);
  const gameDate = new Date(year, month, day);
  const lockDate = new Date(gameDate.getTime() - 24 * 60 * 60 * 1000);
  lockDate.setHours(0, 0, 0, 0);
  return lockDate;
};

const isGameLockedByDate = (dateStr) => {
  const deadline = getGameLockDeadline(dateStr);
  if (!deadline) return false;
  return new Date() >= deadline;
};

const isTournamentLocked = () => {
  const startOfSeason = new Date(2026, 7, 22);
  startOfSeason.setHours(0, 0, 0, 0);
  return new Date() >= startOfSeason;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [matchday, setMatchday] = useState(1);
  const [predictions, setPredictions] = useState({});
  const [tournamentPredictions, setTournamentPredictions] = useState({ champion: '', topScorer: '', topAssists: '', favoriteTeam: '' });
  const [actualScores, setActualScores] = useState({});
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [actualTournament, setActualTournament] = useState({ champion: '', topScorer: '', topAssists: '' });
  const [matchdayGoals, setMatchdayGoals] = useState({});
  const [adminInputPlayer, setAdminInputPlayer] = useState('');
  const [adminInputGoals, setAdminInputGoals] = useState(0);
  const [jokers, setJokers] = useState({});
  const [countdownText, setCountdownText] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [toastText, setToastText] = useState('');

  // שעון עצר דינמי
  useEffect(() => {
    const updateTimer = () => {
      const fixtures = allFixtures[matchday];
      if (!fixtures || fixtures.length === 0) {
        setCountdownText('');
        return;
      }
      let earliestDeadline = null;
      fixtures.forEach(g => {
        const d = getGameLockDeadline(g.time);
        if (d && (!earliestDeadline || d < earliestDeadline)) {
          earliestDeadline = d;
        }
      });

      if (!earliestDeadline) {
        setCountdownText('');
        return;
      }

      const diff = earliestDeadline.getTime() - new Date().getTime();
      if (diff <= 0) {
        setCountdownText('🔒 מחזור זה נעול לניחושים!');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdownText(`⏱️ הזנת ניחושים ננעלת בעוד: ${days} ימים, ${hours} שעות ו-${minutes} דקות`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [matchday]);

  // שעון ותאריך חי בראש האתר
  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  const showToast = (message) => {
    setToastText(message);
    window.setTimeout(() => setToastText(''), 2600);
  };

  const handlePredict = (gameId, value) => {
    setPredictions(prev => {
      const key = `${matchday}-${gameId}`;
      const current = prev[key] || { winner: '', homeScore: 0, awayScore: 0 };
      return { ...prev, [key]: { ...current, winner: value } };
    });
  };

  const handleScoreChange = (gameId, type, delta) => {
    setPredictions(prev => {
      const key = `${matchday}-${gameId}`;
      const current = prev[key] || { winner: '', homeScore: 0, awayScore: 0 };
      let newScore = current[type === 'home' ? 'homeScore' : 'awayScore'] + delta;
      if (newScore < 0) newScore = 0;

      const updated = { ...current, [type === 'home' ? 'homeScore' : 'awayScore']: newScore };
      if (updated.homeScore > updated.awayScore) updated.winner = '1';
      else if (updated.homeScore < updated.awayScore) updated.winner = '2';
      else updated.winner = 'X';

      return { ...prev, [key]: updated };
    });
  };

  const handleAdminScoreChange = (gameId, type, delta) => {
    setActualScores(prev => {
      const key = `${matchday}-${gameId}`;
      const current = prev[key] || { homeScore: 0, awayScore: 0, winner: 'X', isFinished: false };
      let newScore = current[type === 'home' ? 'homeScore' : 'awayScore'] + delta;
      if (newScore < 0) newScore = 0;

      const updated = { ...current, [type === 'home' ? 'homeScore' : 'awayScore']: newScore };
      if (updated.homeScore > updated.awayScore) updated.winner = '1';
      else if (updated.homeScore < updated.awayScore) updated.winner = '2';
      else updated.winner = 'X';

      return { ...prev, [key]: updated };
    });
  };

  const toggleGameFinished = (gameId) => {
    setActualScores(prev => {
      const key = `${matchday}-${gameId}`;
      const current = prev[key] || { homeScore: 0, awayScore: 0, winner: 'X', isFinished: false };
      return { ...prev, [key]: { ...current, isFinished: !current.isFinished } };
    });
  };

  const toggleJoker = (gameId, isLocked) => {
    if (isLocked) return;
    setJokers(prev => {
      if (prev[matchday] === gameId) {
        const updated = { ...prev };
        delete updated[matchday];
        return updated;
      }
      return { ...prev, [matchday]: gameId };
    });
  };

  const addPlayerGoalsByAdmin = () => {
    if (!adminInputPlayer.trim()) return;
    const key = `${matchday}-${adminInputPlayer.trim()}`;
    setMatchdayGoals(prev => ({ ...prev, [key]: (prev[key] || 0) + Number(adminInputGoals) }));
    setAdminInputPlayer('');
    setAdminInputGoals(0);
  };

  const removePlayerGoalsByAdmin = (playerKey) => {
    setMatchdayGoals(prev => {
      const updated = { ...prev };
      delete updated[playerKey];
      return updated;
    });
  };

  const loginAsAdmin = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      const pass = prompt('הכנס סיסמת מנהל מערכת:');
      if (pass === '2531') {
        setIsAdminMode(true);
        alert('התחברת בהצלחה כמנהל!');
      } else if (pass !== null) {
        alert('סיסמה שגויה!');
      }
    }
  };

  const getLiveStatistics = () => {
    let totalPredicted = Object.keys(predictions).length;
    let exactMatches = 0;
    let directionMatches = 0;
    let misses = 0;
    let matchPoints = 0;

    Object.keys(actualScores).forEach(key => {
      const actual = actualScores[key];
      const pred = predictions[key];
      if (actual && actual.isFinished && pred) {
        const [md, gameId] = key.split('-');
        let localPoints = 0;

        if (pred.winner === actual.winner) {
          localPoints += 2;
          if (Number(pred.homeScore) === Number(actual.homeScore) && Number(pred.awayScore) === Number(actual.awayScore)) {
            exactMatches++;
            localPoints += 4;
          } else {
            directionMatches++;
          }
        } else {
          misses++;
        }

        if (jokers[md] && String(jokers[md]) === String(gameId)) {
          localPoints *= 2;
        }
        matchPoints += localPoints;
      }
    });

    let liveScorerGoalsPoints = 0;
    const currentScorer = tournamentPredictions?.topScorer || '';
    if (currentScorer.trim()) {
      Object.keys(matchdayGoals).forEach(key => {
        const parts = key.split('-');
        if (parts.length >= 2 && parts[1].trim() === currentScorer.trim()) {
          liveScorerGoalsPoints += (matchdayGoals[key] || 0) * 2;
        }
      });
    }

    let finalScorerBonus = (actualTournament.topScorer && tournamentPredictions.topScorer && actualTournament.topScorer.trim() === tournamentPredictions.topScorer.trim()) ? 40 : 0;
    let finalChampionBonus = (actualTournament.champion && tournamentPredictions.champion && actualTournament.champion.trim() === tournamentPredictions.champion.trim()) ? 40 : 0;
    let finalAssistsBonus = (actualTournament.topAssists && tournamentPredictions.topAssists && actualTournament.topAssists.trim() === tournamentPredictions.topAssists.trim()) ? 50 : 0;

    const totalPoints = matchPoints + liveScorerGoalsPoints + finalScorerBonus + finalChampionBonus + finalAssistsBonus;

    return {
      totalPredicted,
      exactMatches,
      directionMatches,
      misses,
      topScorerTotalPoints: liveScorerGoalsPoints + finalScorerBonus,
      championPoints: finalChampionBonus,
      topAssistsPoints: finalAssistsBonus,
      totalPoints
    };
  };

  const getMatchdayScoreOnly = () => {
    let matchdayPoints = 0;
    allFixtures[matchday]?.forEach(game => {
      const key = `${matchday}-${game.id}`;
      const actual = actualScores[key];
      const pred = predictions[key];
      if (actual && actual.isFinished && pred) {
        let p = 0;
        if (pred.winner === actual.winner) {
          p += 2;
          if (Number(pred.homeScore) === Number(actual.homeScore) && Number(pred.awayScore) === Number(actual.awayScore)) p += 4;
        }
        if (jokers[matchday] && String(jokers[matchday]) === String(game.id)) {
          p *= 2;
        }
        matchdayPoints += p;
      }
    });

    const currentScorer = tournamentPredictions?.topScorer || '';
    if (currentScorer.trim()) {
      const goalKey = `${matchday}-${currentScorer.trim()}`;
      if (matchdayGoals[goalKey]) {
        matchdayPoints += matchdayGoals[goalKey] * 2;
      }
    }
    return matchdayPoints;
  };

  const saveCurrentMatchday = () => {
    const currentFixtures = allFixtures[matchday] || [];
    const predictedCount = currentFixtures.filter(game => predictions[`${matchday}-${game.id}`]?.winner).length;
    showToast(`✅ נשמרו ${predictedCount} ניחושים למחזור ${matchday}. כרגע זו שמירה זמנית בלבד ותימחק ברענון.`);
  };

  const clearCurrentMatchday = () => {
    setPredictions(prev => {
      const updated = { ...prev };
      (allFixtures[matchday] || []).forEach(game => delete updated[`${matchday}-${game.id}`]);
      return updated;
    });
    setJokers(prev => {
      const updated = { ...prev };
      delete updated[matchday];
      return updated;
    });
    showToast(`🧹 הניחושים במחזור ${matchday} אופסו זמנית.`);
  };

  const stats = getLiveStatistics();
  const currentMatchdayScore = getMatchdayScoreOnly();

  let goalsPoints = 0;
  const currentScorer = tournamentPredictions?.topScorer || '';
  if (currentScorer.trim()) {
    Object.keys(matchdayGoals).forEach(key => {
      const parts = key.split('-');
      if (parts.length >= 2 && parts[1].trim() === currentScorer.trim()) {
        goalsPoints += (matchdayGoals[key] || 0) * 2;
      }
    });
  }

  const userTeamSuffix = tournamentPredictions.favoriteTeam ? ` (${tournamentPredictions.favoriteTeam})` : '';
  const leaderboard = FRIENDS.map((friend, idx) => ({
    name: idx === 0 ? `${friend.name}${userTeamSuffix}` : friend.name,
    points: Math.max(0, stats.totalPoints - idx * 6 - (idx % 3) * 3),
    trend: idx === 0 && stats.totalPoints > 0 ? '▲' : idx % 4 === 0 ? '▼' : idx % 2 === 0 ? '▲' : '–',
    icon: friend.icon,
    role: friend.role
  })).sort((a, b) => b.points - a.points);
  const predictedThisMatchday = (allFixtures[matchday] || []).filter(game => predictions[`${matchday}-${game.id}`]?.winner).length;
  const formattedTime = currentDateTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentDateTime.toLocaleDateString('he-IL', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  const totalGamesInMatchday = (allFixtures[matchday] || []).length;
  const predictionProgress = totalGamesInMatchday ? Math.round((predictedThisMatchday / totalGamesInMatchday) * 100) : 0;
  const finishedGames = Object.values(actualScores).filter(game => game?.isFinished).length;
  const exactRate = stats.totalPredicted ? Math.round((stats.exactMatches / Math.max(1, stats.totalPredicted)) * 100) : 0;
  const nextBigMatch = (allFixtures[matchday] || [])[0];
  const avgPointsPerFinished = finishedGames ? Math.round(stats.totalPoints / Math.max(1, finishedGames)) : 0;
  const jokerActive = jokers[matchday] ? 'פעיל' : 'לא סומן';
  const seasonPulse = [
    { label: 'מחזור נוכחי', value: matchday, tone: 'text-yellow-300', icon: '📅' },
    { label: 'ג׳וקר מחזור', value: jokerActive, tone: jokers[matchday] ? 'text-emerald-300' : 'text-gray-300', icon: '🃏' },
    { label: 'ממוצע נק׳ למשחק', value: avgPointsPerFinished, tone: 'text-sky-300', icon: '📈' },
    { label: 'ניחושים במחזור', value: `${predictedThisMatchday}/${totalGamesInMatchday}`, tone: 'text-purple-300', icon: '🎯' }
  ];
  const achievements = [
    { title: 'בול מדויק', value: stats.exactMatches, desc: 'תוצאות מדויקות', icon: '🎯' },
    { title: 'כיוון נכון', value: stats.directionMatches, desc: '1/X/2 נכונים', icon: '✅' },
    { title: 'נק׳ מלך שערים', value: stats.topScorerTotalPoints, desc: 'בונוסים ושערים', icon: '👟' },
    { title: 'מחזור נוכחי', value: currentMatchdayScore, desc: 'נקודות במחזור', icon: '⚡' }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#1f2937_0,_#030712_45%,_#020617_100%)] text-white p-4 pb-24" style={{ direction: 'rtl' }}>
      {toastText && (
        <div className="fixed left-1/2 top-4 z-[999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-yellow-500/30 bg-gray-950/95 px-4 py-3 text-center text-xs font-black text-yellow-300 shadow-2xl backdrop-blur-xl">
          {toastText}
        </div>
      )}
      
      <div className="sticky top-0 bg-gray-950/80 backdrop-blur-2xl pt-2 pb-3 z-50 max-w-md mx-auto border-b border-yellow-500/10">
        <header className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4 text-center shadow-2xl">
          <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-yellow-500/10 blur-2xl"></div>
          <div className="absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
          <div className="relative">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-gray-950 bg-yellow-500 text-3xl shadow-inner">🏆</div>
            <h1 className="text-3xl font-extrabold text-yellow-400 drop-shadow-md">10 חבר'ה - יוספטל v4</h1>
            <p className="mt-1 text-[11px] font-bold text-gray-400">ליגת ניחושים פרטית · Premium v4 · Winner League 26/27</p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-right">
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3">
                <div className="text-[10px] font-black text-gray-500">🗓️ תאריך</div>
                <div className="mt-1 text-xs font-black text-gray-100">{formattedDate}</div>
              </div>
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3">
                <div className="text-[10px] font-black text-yellow-500">⏰ שעה חיה</div>
                <div className="mt-1 font-mono text-lg font-black tracking-wider text-yellow-300" style={{ direction: 'ltr' }}>{formattedTime}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-gray-950/70 p-2 border border-gray-800">
                <div className="text-[10px] text-gray-500 font-bold">מחזור</div>
                <div className="text-lg font-black text-white">{matchday}</div>
              </div>
              <div className="rounded-xl bg-gray-950/70 p-2 border border-gray-800">
                <div className="text-[10px] text-gray-500 font-bold">ניחשת</div>
                <div className="text-lg font-black text-emerald-400">{predictedThisMatchday}/{(allFixtures[matchday] || []).length}</div>
              </div>
              <div className="rounded-xl bg-gray-950/70 p-2 border border-gray-800">
                <div className="text-[10px] text-gray-500 font-bold">נקודות</div>
                <div className="text-lg font-black text-yellow-400">{stats.totalPoints}</div>
              </div>
            </div>

            {isAdminMode && <span className="inline-block bg-red-950 text-red-400 border border-red-900 font-bold text-[10px] px-2 py-0.5 rounded-full mt-3 animate-pulse">🛠️ פאנל מנהל פעיל</span>}
          </div>
        </header>

        <nav className="mt-3 grid grid-cols-6 gap-1 bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800 shadow-xl">
          <button type="button" onClick={() => setCurrentTab('dashboard')} className={`py-2 text-[8px] font-black rounded-lg transition-all ${currentTab === 'dashboard' ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400'}`}>🏠 בית</button>
          <button type="button" onClick={() => setCurrentTab('predictions')} className={`py-2 text-[8px] font-black rounded-lg transition-all ${currentTab === 'predictions' ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400'}`}>⚽ משחקים</button>
          <button type="button" onClick={() => setCurrentTab('tournament')} className={`py-2 text-[8px] font-black rounded-lg transition-all ${currentTab === 'tournament' ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400'}`}>👑 הטורניר שלי</button>
          <button type="button" onClick={() => setCurrentTab('stats')} className={`py-2 text-[8px] font-black rounded-lg transition-all ${currentTab === 'stats' ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400'}`}>📈 סטטיסטיקה</button>
          <button type="button" onClick={() => setCurrentTab('leaderboard')} className={`py-2 text-[8px] font-black rounded-lg transition-all ${currentTab === 'leaderboard' ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400'}`}>📊 הטבלה</button>
          <button type="button" onClick={() => setCurrentTab('rules')} className={`py-2 text-[8px] font-black rounded-lg transition-all ${currentTab === 'rules' ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400'}`}>ℹ️ חוקים</button>
        </nav>
      </div>

      <div className="max-w-md mx-auto mt-4">
        

        {currentTab === 'dashboard' && (
          <div className="space-y-5">
            <section className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 shadow-2xl">
              <div className="absolute -top-16 -left-12 h-36 w-36 rounded-full bg-yellow-500/10 blur-3xl"></div>
              <div className="absolute -bottom-20 -right-10 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl"></div>
              <div className="relative">
                <div className="inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[10px] font-black text-yellow-300">🔥 LIVE CONTROL ROOM</div>
                <h2 className="mt-3 text-2xl font-black leading-tight text-white">ברוך הבא לליגת הניחושים של יוספטל</h2>
                <p className="mt-2 text-xs font-bold leading-6 text-gray-400">מסך בית חדש עם מצב מחזור, התקדמות ניחושים, משחק מרכזי, חבר'ה וטבלת בזק. בלי ענן ובלי שמירה קבועה כרגע.</p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3 text-center">
                    <div className="text-[10px] font-bold text-gray-500">התקדמות</div>
                    <div className="mt-1 text-xl font-black text-emerald-400">{predictionProgress}%</div>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3 text-center">
                    <div className="text-[10px] font-bold text-gray-500">משחקים הסתיימו</div>
                    <div className="mt-1 text-xl font-black text-yellow-400">{finishedGames}</div>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3 text-center">
                    <div className="text-[10px] font-bold text-gray-500">דיוק בולים</div>
                    <div className="mt-1 text-xl font-black text-sky-400">{exactRate}%</div>
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full rounded-full bg-gradient-to-l from-yellow-400 to-emerald-400 transition-all" style={{ width: `${predictionProgress}%` }}></div>
                </div>
              </div>
            </section>

            {nextBigMatch && (
              <section className="rounded-3xl border border-gray-800 bg-gray-900/90 p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-black text-yellow-400">⚡ המשחק הראשון במחזור {matchday}</h3>
                  <span className="rounded-full bg-gray-950 px-2 py-1 text-[10px] font-bold text-gray-400">{nextBigMatch.time}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className={`rounded-2xl bg-gradient-to-br ${getTeamGradient(nextBigMatch.home)} border border-gray-800 p-3 text-center`}>
                    <div className="text-3xl">{getTeamBadge(nextBigMatch.home)}</div>
                    <div className="mt-1 text-xs font-black text-white">{nextBigMatch.home}</div>
                  </div>
                  <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs font-black text-yellow-300">VS</div>
                  <div className={`rounded-2xl bg-gradient-to-br ${getTeamGradient(nextBigMatch.away)} border border-gray-800 p-3 text-center`}>
                    <div className="text-3xl">{getTeamBadge(nextBigMatch.away)}</div>
                    <div className="mt-1 text-xs font-black text-white">{nextBigMatch.away}</div>
                  </div>
                </div>
                <button type="button" onClick={() => setCurrentTab('predictions')} className="mt-4 w-full rounded-2xl bg-yellow-500 py-3 text-xs font-black text-gray-950 shadow-lg">עבור לניחוש המחזור ⚽</button>
              </section>
            )}

            <section className="rounded-3xl border border-yellow-500/15 bg-gray-950/70 p-4 shadow-2xl card-glow">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black text-white">⚡ לוח בקרה מהיר</h3>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-300">v4 Premium</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {seasonPulse.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-3">
                    <div className="text-xl">{item.icon}</div>
                    <div className="mt-1 text-[10px] font-bold text-gray-500">{item.label}</div>
                    <div className={`mt-1 text-lg font-black ${item.tone}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              {achievements.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900/90 p-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-2xl font-black text-yellow-300">{item.value}</span>
                  </div>
                  <div className="mt-2 text-sm font-black text-white">{item.title}</div>
                  <div className="text-[10px] text-gray-500">{item.desc}</div>
                </div>
              ))}
            </section>

            <section className="rounded-3xl border border-gray-800 bg-gray-900/80 p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black text-yellow-400">👥 10 המשתתפים</h3>
                <span className="text-[10px] font-bold text-gray-500">ללא שמות אישיים</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FRIENDS.map((friend) => (
                  <div key={friend.name} className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3 shadow-lg">
                    <div className="text-2xl">{friend.icon}</div>
                    <div className="mt-1 text-sm font-black text-white">{friend.name}</div>
                    <div className="text-[10px] font-bold text-yellow-400">{friend.role}</div>
                    <div className="mt-1 text-[10px] text-gray-500">{friend.vibe}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-xl space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1.5">בחר מחזור ליגה:</label>
                <select value={matchday} onChange={(e) => setMatchday(Number(e.target.value))} className="w-full bg-gray-800 p-3 rounded-lg text-white font-bold border border-gray-700 focus:outline-none">
                  {[...Array(36).keys()].map(i => <option key={i+1} value={i+1}>{i+1 >= 27 ? `🔥 פלייאוף - מחזור ${i+1}` : `⚽ מחזור ${i+1}`}</option>)}
                </select>
              </div>

              {countdownText && (
                <div className={`p-2 rounded-lg text-center text-xs font-black border ${countdownText.includes('🔒') ? 'bg-red-950/40 border-red-900 text-red-400' : 'bg-amber-950/30 border-amber-900/60 text-amber-400'}`}>
                  {countdownText}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={saveCurrentMatchday} className="rounded-xl bg-yellow-500 py-3 text-xs font-black text-gray-950 shadow-lg shadow-yellow-500/10 transition hover:scale-[1.02]">💾 שמור ניחושים</button>
                <button type="button" onClick={clearCurrentMatchday} className="rounded-xl border border-gray-700 bg-gray-950 py-3 text-xs font-black text-gray-300 transition hover:border-red-700 hover:text-red-300">🧹 איפוס מחזור</button>
              </div>

              <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 text-center text-xs font-bold text-gray-300">
                📊 ניקוד שנצבר עבורך במחזור {matchday}: <span className="text-yellow-500 text-sm font-black">{currentMatchdayScore} נק'</span>
                <div className="mt-1 text-[10px] font-bold text-gray-500">הערה: בשלב הזה אין שמירה קבועה. רענון הדף מאפס הכול.</div>
              </div>
            </div>

            {isAdminMode && (
              <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-black text-red-400">⚙️ עדכון שערים למחזור {matchday}:</h3>
                <div className="flex gap-2">
                  <input type="text" value={adminInputPlayer} onChange={(e) => setAdminInputPlayer(e.target.value)} placeholder="שם השחקן שהבקיע..." className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs font-bold text-white focus:outline-none"/>
                  <input type="number" value={adminInputGoals} onChange={(e) => setAdminInputGoals(Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs font-black text-yellow-500 text-center focus:outline-none"/>
                  <button type="button" onClick={addPlayerGoalsByAdmin} className="bg-yellow-500 text-gray-950 text-xs font-black px-3 rounded-lg">הוסף</button>
                </div>
                <div className="space-y-1.5 pt-1">
                  {Object.keys(matchdayGoals).filter(k => k.startsWith(`${matchday}-`)).map(k => (
                    <div key={k} className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800 text-xs">
                      <span className="font-bold text-gray-300">⚽ {k.split('-')[1]}: <span className="text-yellow-500 font-black">{matchdayGoals[k]} שערים</span></span>
                      <button type="button" onClick={() => removePlayerGoalsByAdmin(k)} className="text-red-500 font-bold px-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <section className="space-y-4">
              {allFixtures[matchday]?.map((game) => {
                const gameKey = `${matchday}-${game.id}`;
                const gamePrediction = predictions[gameKey] || { winner: '', homeScore: 0, awayScore: 0 };
                const actual = actualScores[gameKey] || { homeScore: 0, awayScore: 0, winner: 'X', isFinished: false };
                
                const isLocked = isGameLockedByDate(game.time) || actual.isFinished;
                const isCurrentJoker = jokers[matchday] === game.id;

                let pointsEarned = null;
                if (actual.isFinished && gamePrediction.winner) {
                  pointsEarned = 0;
                  if (gamePrediction.winner === actual.winner) {
                    pointsEarned = (Number(gamePrediction.homeScore) === Number(actual.homeScore) && Number(gamePrediction.awayScore) === Number(actual.awayScore)) ? 6 : 2;
                    if (isCurrentJoker) pointsEarned *= 2;
                  }
                }

                return (
                  <div key={game.id} className={`border rounded-2xl p-4 shadow-xl space-y-3 transition-all hover:-translate-y-0.5 hover:shadow-2xl ${isCurrentJoker ? 'bg-gradient-to-br from-gray-900 to-amber-950/40 border-yellow-500/70 ring-1 ring-yellow-500/20' : 'bg-gray-900/90 border-gray-800'}`}>
                    <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                      <span>{matchday >= 27 ? 'פלייאוף ליגת ווינר' : 'ליגת העל'} • {game.time}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isLocked}
                          onClick={() => toggleJoker(game.id, isLocked)}
                          className={`px-2 py-0.5 rounded text-[10px] font-black transition-all border ${isCurrentJoker ? 'bg-yellow-500 border-yellow-500 text-gray-950 scale-105' : 'bg-gray-950 border-gray-800 text-gray-500 hover:text-gray-300 disabled:opacity-40'}`}
                        >
                          {isCurrentJoker ? "🃏 ג'וקר פעיל!" : "🃏 סמן ג'וקר"}
                        </button>
                        {actual.isFinished ? (
                          <span className="bg-red-950 text-red-400 border border-red-900 text-[10px] px-2 py-0.5 rounded-md font-bold">🛑 הסתיים</span>
                        ) : isGameLockedByDate(game.time) ? (
                          <span className="bg-amber-950 text-amber-400 border border-amber-900 text-[10px] px-2 py-0.5 rounded-md font-bold">🔒 נעול</span>
                        ) : null}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="font-bold text-base text-gray-100 w-5/12 text-right break-words"><span className="ml-1">{getTeamBadge(game.home)}</span>{game.home}</span>
                      <span className="text-gray-600 text-xs font-black px-2">VS</span>
                      <span className="font-bold text-base text-gray-100 w-5/12 text-left break-words">{game.away}<span className="mr-1">{getTeamBadge(game.away)}</span></span>
                    </div>

                    {actual.isFinished && (
                      <div className="bg-gray-950 p-2.5 rounded-xl border border-dashed border-gray-800 text-center flex justify-between items-center px-4">
                        <span className="text-xs font-bold text-gray-400">תוצאת אמת סופית:</span>
                        <span className="font-black text-sm text-yellow-500">{actual.homeScore} - {actual.awayScore}</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${pointsEarned > 0 ? 'bg-green-950 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                          {pointsEarned > 0 ? `👍 זכית (+${pointsEarned})` : "0 נק'"}
                        </span>
                      </div>
                    )}

                    {!isLocked ? (
                      <div className="flex justify-between items-center bg-gray-950 p-3 rounded-xl border border-gray-800/80 mt-1">
                        <span className="text-xs font-bold text-gray-400">הניחוש שלך:</span>
                        <div className="flex items-center gap-3" style={{ direction: 'ltr' }}>
                          <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                            <button type="button" onClick={() => handleScoreChange(game.id, 'away', -1)} className="px-2.5 py-1 text-gray-400 font-black text-sm">-</button>
                            <span className="px-3 py-1 font-black text-yellow-500 min-w-[28px] text-center bg-gray-900 text-base border-x border-gray-700">{gamePrediction.awayScore}</span>
                            <button type="button" onClick={() => handleScoreChange(game.id, 'away', 1)} className="px-2.5 py-1 text-gray-400 font-black text-sm">+</button>
                          </div>
                          <span className="text-gray-600 font-black text-sm">:</span>
                          <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                            <button type="button" onClick={() => handleScoreChange(game.id, 'home', -1)} className="px-2.5 py-1 text-gray-400 font-black text-sm">-</button>
                            <span className="px-3 py-1 font-black text-yellow-500 min-w-[28px] text-center bg-gray-900 text-base border-x border-gray-700">{gamePrediction.homeScore}</span>
                            <button type="button" onClick={() => handleScoreChange(game.id, 'home', 1)} className="px-2.5 py-1 text-gray-400 font-black text-sm">+</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-950/40 p-2 text-center rounded-lg border border-gray-900 text-xs text-gray-400">
                        הניחוש השמור שלך: <span className="text-white font-bold">{gamePrediction.winner ? `${gamePrediction.homeScore}-${gamePrediction.awayScore} (${gamePrediction.winner})` : 'לא ניחשת'}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {['1', 'X', '2'].map((option) => (
                        <button key={option} type="button" disabled={isLocked} onClick={() => handlePredict(game.id, option)} className={`py-2 text-xs font-black rounded-lg border transition-all ${gamePrediction.winner === option ? 'bg-yellow-500 border-yellow-500 text-gray-950 scale-105 shadow-md' : 'bg-gray-800 border-gray-700 text-gray-300 disabled:opacity-50'}`}>
                          {option === '1' ? '1 (בית)' : option === 'X' ? 'X (תיקו)' : '2 (חוץ)'}
                        </button>
                      ))}
                    </div>

                    {isLocked && (
                      <div className="bg-gray-950 border border-gray-800/80 rounded-xl p-3 mt-2 space-y-1.5">
                        <span className="text-[10px] font-black text-yellow-500 tracking-wide block">👥 ניחושי המשתתפים:</span>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                          <div className="bg-gray-900/50 p-1.5 rounded border border-gray-900/80">👤 משתתף 2: <span className="text-white font-bold">2 - 1 (1)</span></div>
                          <div className="bg-gray-900/50 p-1.5 rounded border border-gray-900/80">👤 משתתף 3: <span className="text-white font-bold">1 - 1 (X)</span></div>
                          <div className="bg-gray-900/50 p-1.5 rounded border border-gray-900/80">👤 משתתף 4: <span className="text-white font-bold">0 - 2 (2)</span></div>
                          <div className="bg-gray-900/50 p-1.5 rounded border border-gray-900/80">👤 משתתף 5: <span className="text-white font-bold">3 - 1 (1)</span></div>
                        </div>
                      </div>
                    )}

                    {isAdminMode && (
                      <div className="mt-3 pt-3 border-t border-red-900/40 bg-red-950/20 p-3 rounded-xl border border-red-900/30 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-red-400">⚙️ עדכון תוצאת אמת (מנהל):</span>
                          <button type="button" onClick={() => toggleGameFinished(game.id)} className={`px-3 py-1 text-[11px] font-black rounded-md border transition-all ${actual.isFinished ? 'bg-green-950 border-green-800 text-green-400' : 'bg-red-900 border-red-700 text-white'}`}>
                            {actual.isFinished ? '🔓 פתח משחק' : '🔒 סיום ונעילה'}
                          </button>
                        </div>
                        <div className="flex justify-center items-center gap-4" style={{ direction: 'ltr' }}>
                          <div className="flex items-center bg-gray-800 border border-red-900/50 overflow-hidden">
                            <button type="button" onClick={() => handleAdminScoreChange(game.id, 'away', -1)} className="px-3 py-1 text-red-400 font-bold bg-gray-800">-</button>
                            <span className="px-4 py-1 font-black text-white min-w-[32px] text-center bg-gray-900">{actual.awayScore}</span>
                            <button type="button" onClick={() => handleAdminScoreChange(game.id, 'away', 1)} className="px-3 py-1 text-red-400 font-bold bg-gray-800">+</button>
                          </div>
                          <span className="text-red-400 font-black text-lg">:</span>
                          <div className="flex items-center bg-gray-800 border border-red-900/50 overflow-hidden">
                            <button type="button" onClick={() => handleAdminScoreChange(game.id, 'home', -1)} className="px-3 py-1 text-red-400 font-bold bg-gray-800">-</button>
                            <span className="px-4 py-1 font-black text-white min-w-[32px] text-center bg-gray-900">{actual.homeScore}</span>
                            <button type="button" onClick={() => handleAdminScoreChange(game.id, 'home', 1)} className="px-3 py-1 text-red-400 font-bold bg-gray-800">+</button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </section>
          </div>
        )}

        {/* לשונית 2: הטורניר שלי */}
        {currentTab === 'tournament' && (
          <div className="space-y-6">
            {isAdminMode && (
              <div className="bg-red-950/20 border border-red-900/40 p-5 rounded-2xl space-y-4 shadow-xl">
                <h3 className="text-sm font-black text-red-400">⚙️ הגדרת תוצאות אמת לסוף העונה (מנהל):</h3>
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">האלופה הרשמית:</label>
                    <input type="text" value={actualTournament.champion} onChange={(e) => setActualTournament(prev => ({...prev, champion: e.target.value}))} className="w-full bg-gray-900 p-2.5 border border-red-900/40 rounded-lg font-bold text-white focus:outline-none" placeholder="הזן את האלופה שזכתה באמת..."/>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">מלך השערים הסופי:</label>
                    <input type="text" value={actualTournament.topScorer} onChange={(e) => setActualTournament(prev => ({...prev, topScorer: e.target.value}))} className="w-full bg-gray-900 p-2.5 border border-red-900/40 rounded-lg font-bold text-white focus:outline-none" placeholder="הזן את מלך השערים הסופי..."/>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">מלך הבישולים הסופי:</label>
                    <input type="text" value={actualTournament.topAssists} onChange={(e) => setActualTournament(prev => ({...prev, topAssists: e.target.value}))} className="w-full bg-gray-900 p-2.5 border border-red-900/40 rounded-lg font-bold text-white focus:outline-none" placeholder="הזן את מלך הבישולים הסופי..."/>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#1e3d2f] border border-[#2a5441] rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 text-center border-b border-[#2a5441]/60 flex flex-col items-center">
                <div className="w-24 h-24 bg-yellow-500 rounded-full flex flex-col items-center justify-center border-4 border-[#12261d] relative shadow-inner">
                  <span className="text-gray-950 font-black text-[13px] leading-tight text-center">10 חבר'ה</span>
                  <span className="text-gray-950 text-[8px] tracking-wider font-bold -mt-0.5">יוספטל</span>
                  <div className="absolute bottom-1 bg-gray-900/80 p-1 rounded-full text-yellow-500 text-[10px]">📷</div>
                </div>
                <h2 className="text-xl font-black text-white mt-3">📝 הניחושים המיוחדים שלי</h2>
                {isTournamentLocked() && (
                  <span className="inline-block bg-amber-950 text-amber-400 border border-amber-900 font-bold text-xs px-3 py-1 rounded-full mt-2">
                    🔒 הניחושים נעולים לכל העונה!
                  </span>
                )}
              </div>
              <div className="bg-gray-900 p-5 space-y-5">
                
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-md">
                  <label className="block text-sm font-black text-gray-300 mb-2">🏆 הקבוצה האהודה שלי בארץ:</label>
                  <select 
                    disabled={isTournamentLocked()} 
                    value={tournamentPredictions.favoriteTeam} 
                    onChange={(e) => setTournamentPredictions(prev => ({...prev, favoriteTeam: e.target.value}))}
                    className="w-full bg-gray-800 p-3 rounded-lg text-white font-bold border border-gray-700 text-sm focus:outline-none"
                  >
                    <option value="">-- בחר קבוצה --</option>
                    {ISRAELI_TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
                  </select>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-md">
                  <label className="block text-sm font-black text-gray-300 mb-2">🏆 האלופה שלי:</label>
                  <input type="text" disabled={isTournamentLocked()} value={tournamentPredictions.champion} onChange={(e) => setTournamentPredictions(prev => ({...prev, champion: e.target.value}))} placeholder={isTournamentLocked() ? 'הניחוש נעול' : 'הקלד את שם האלופה המשוערת...'} className="w-full bg-gray-800 p-3 rounded-lg text-white font-bold border border-gray-700 text-sm focus:outline-none disabled:opacity-50"/>
                  <div className="text-left text-xs text-yellow-500 font-bold mt-1.5">מענק זכייה בסוף העונה: 40 נקודות</div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-md">
                  <label className="block text-sm font-black text-gray-300 mb-2">👟 מלך השערים שלי:</label>
                  <input type="text" disabled={isTournamentLocked()} value={tournamentPredictions.topScorer} onChange={(e) => setTournamentPredictions(prev => ({...prev, topScorer: e.target.value}))} placeholder={isTournamentLocked() ? 'הניחוש נעול' : 'הקלד את מלך השערים שלך...'} className="w-full bg-gray-800 p-3 rounded-lg text-white font-bold border border-gray-700 text-sm focus:outline-none disabled:opacity-50"/>
                  <div className="flex justify-between text-[11px] font-bold mt-2 border-t border-gray-900 pt-2">
                    <span className="text-gray-400">מענק סופי: 40 נק'</span>
                    <span className="text-yellow-500 font-black">🔥 נצבר במחזורים: +{goalsPoints} נק'</span>
                  </div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-md">
                  <label className="block text-sm font-black text-gray-300 mb-2">🎯 מלך הבישולים שלי:</label>
                  <input type="text" disabled={isTournamentLocked()} value={tournamentPredictions.topAssists} onChange={(e) => setTournamentPredictions(prev => ({...prev, topAssists: e.target.value}))} placeholder={isTournamentLocked() ? 'הניחוש נעול' : 'הקלד את מלך הבישולים שלך...'} className="w-full bg-gray-800 p-3 rounded-lg text-white font-bold border border-gray-700 text-sm focus:outline-none disabled:opacity-50"/>
                  <div className="text-left text-xs text-yellow-500 font-bold mt-1.5">מענק ניחוש סופי: 50 נקודות</div>
                </div>
              </div>
              <div className="bg-gray-950 p-4 text-center border-t border-gray-800">
                {!isTournamentLocked() ? (
                  <button type="button" onClick={() => showToast('✅ הניחושי הטורניר נשמרו זמנית. אחרי רענון הם יימחקו, כמו שביקשת.')} className="w-full bg-[#1e3d2f] text-white font-black py-3 rounded-xl border border-[#2a5441]">שמור שינויים</button>
                ) : (
                  <div className="text-xs text-gray-500 font-bold py-2">🔒 נעול – לא ניתן לבצע שינויים עד סוף העונה</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* לשונית 3: סטטיסטיקה */}
        {currentTab === 'stats' && (
          <div className="space-y-5 max-w-md mx-auto text-center">
            <div>
              <h2 className="text-3xl font-black text-emerald-500 drop-shadow-sm tracking-wide">סטטיסטיקות</h2>
              <p className="text-lg font-black text-yellow-500 mt-1">סה"כ {stats.totalPoints} נק'</p>
            </div>

            <div className="bg-white text-gray-900 rounded-2xl p-5 shadow-2xl border border-gray-200 text-right space-y-1">
              <div className="flex justify-between items-center py-3.5 border-b border-gray-100">
                <span className="font-black text-xl text-gray-800 pr-2">{stats.totalPredicted}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-700">סה"כ ניחוש משחקים</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-800"></span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3.5 border-b border-gray-100">
                <span className="font-black text-xl text-green-600 pr-2">{stats.exactMatches}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-green-600">סה"כ ניחושים מדויקים</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3.5 border-b border-gray-100">
                <span className="font-black text-xl text-gray-600 pr-2">{stats.directionMatches}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">סה"כ ניחושי כיוון</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3.5 border-b border-gray-100">
                <span className="font-black text-xl text-red-500 pr-2">{stats.misses}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-red-500">סה"כ פספוסים</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3.5 border-b border-gray-100">
                <span className="font-black text-xl text-amber-500 pr-2">{stats.topScorerTotalPoints}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-amber-500">נקודות ממלך השערים</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3.5 border-b border-gray-100">
                <span className="font-black text-xl text-emerald-900 pr-2">{stats.championPoints}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-900">נקודות מהקבוצה הזוכה</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-900"></span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3.5">
                <span className="font-black text-xl text-blue-600 pr-2">{stats.topAssistsPoints}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-blue-600">נקודות ממלך הבישולים</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* לשונית 4: טבלת מובילים */}
        {currentTab === 'leaderboard' && (
          <section className="space-y-4">
            <div className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 shadow-2xl card-glow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">📊 טבלת המובילים</h2>
                  <p className="mt-1 text-[11px] font-bold text-gray-500">דירוג דמו זמני עד שנחבר מערכת משתמשים מלאה</p>
                </div>
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-center">
                  <div className="text-[10px] font-bold text-yellow-500">סה״כ נק׳</div>
                  <div className="text-xl font-black text-yellow-300">{stats.totalPoints}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {leaderboard.map((user, idx) => (
                <div key={user.name} className={`relative overflow-hidden rounded-2xl border p-3 shadow-xl ${idx === 0 ? 'border-yellow-500/40 bg-gradient-to-l from-yellow-500/15 to-gray-900' : 'border-gray-800 bg-gray-900/90'}`}>
                  <div className="absolute -left-8 -top-8 h-20 w-20 rounded-full bg-yellow-500/10 blur-2xl"></div>
                  <div className="relative flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl font-black ${idx === 0 ? 'bg-yellow-500 text-gray-950' : 'bg-gray-950 text-white border border-gray-800'}`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{user.icon}</span>
                        <span className="font-black text-white">{user.name}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] font-bold text-gray-500">{user.role}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-black text-yellow-300">{user.points}</div>
                      <div className={`text-[10px] font-black ${user.trend === '▲' ? 'text-emerald-400' : user.trend === '▼' ? 'text-red-400' : 'text-gray-500'}`}>{user.trend}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* לשונית 5: חוקים */}
        {currentTab === 'rules' && (
          <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-md">
              <h2 className="text-yellow-500 font-black text-lg mb-2 flex items-center gap-2">🎯 שיטת הניקוד המעודכנת</h2>
              <div>
                <h3 className="text-white font-black text-sm mb-1">⚽ ניקוד משחקים:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400 mr-2">
                  <li>ניחוש כיוון (1,X,2) נכון: מעניק <span className="text-white">2 נקודות</span>.</li>
                  <li>ניחוש תוצאה מדויקת נכון: מוסיף עוד <span className="text-yellow-500 font-bold">4 נק' בונוס</span> (סה"כ 6 נקודות).</li>
                  <li><span className="text-yellow-500 font-bold">🃏 חוק הג'וקר:</span> משחק שסומן על ידך כג'וקר המחזור (אחד למחזור) יקבל **כפל ניקוד** (4 נק' על כיוון, 12 נק' על בול!).</li>
                </ul>
              </div>
              <div className="border-t border-gray-800 pt-3 mt-3">
                <h3 className="text-white font-black text-sm mb-1">🔥 חוקי שחקנים ומענקים מיוחדים:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400 mr-2">
                  <li><span className="text-yellow-500 font-bold">⏱️ דדליין ונעילה אוטומטית:</span> לא ניתן לנחש או לשנות ניחוש של משחק החל מיום שלפני המחזור (שעון עצר מופיע בראש המסך!).</li>
                  <li><span className="text-yellow-500 font-bold">🔒 נעילת הטורניר שלי:</span> הבחירות לאלופה, מלך שערים, מלך בישולים וקבוצה אהודה יינעלו לחלוטין ברגע שהמחזור הראשון ייפתח.</li>
                  <li><span className="text-yellow-500 font-bold">📈 חצי מגמה:</span> חצי המגמה בטבלה (▲ / ▼ / –) מציגים בכל מחזור את תנועת המיקומים של השחקנים.</li>
                  <li><span className="text-yellow-500 font-bold">חשיפת ניחושים:</span> ברגע שמשחק ננעל, כולם יכולים לראות את הניחושים של כולם בלייב!</li>
                  <li><span className="text-yellow-500 font-bold">ריצה במחזורים:</span> בכל פעם ששחקן שנבחר כמלך השערים מבקיע גול במחזור, המשתמש מקבל <span className="text-yellow-500 font-bold">2 נקודות לכל גול</span>!</li>
                  <li><span className="text-white font-bold">👑 ניחוש מלך השערים הסופי:</span> מעניק <span className="text-white font-bold">40 נקודות</span> בסוף העונה.</li>
                  <li><span className="text-white font-bold">👑 ניחוש האלופה הסופית:</span> מעניק <span className="text-white font-bold">40 נקודות</span> בסוף העונה.</li>
                  <li><span className="text-white font-bold">👑 ניחוש מלך הבישולים הסופי:</span> מעניק <span className="text-white font-bold">50 נקודות</span> בסוף העונה.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* כפתור מנהל מערכת */}
      <footer className="max-w-md mx-auto mt-12 text-center">
        <button type="button" onClick={loginAsAdmin} className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${isAdminMode ? 'bg-red-950 border-red-800 text-red-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white'}`}>
          {isAdminMode ? '🔒 צא ממצב מנהל' : '🔧 ניהול מערכת (הזנת תוצאות אמת)'}
        </button>
      </footer>

    </div>
  );
}
