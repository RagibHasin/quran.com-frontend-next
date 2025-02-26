/* eslint-disable max-lines */
import React, { useMemo } from 'react';

import useTranslation from 'next-translate/useTranslation';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import styles from './QuranFontSection.module.scss';
import QuranFontSectionFooter from './QuranFontSectionFooter';
import Section from './Section';
import VersePreview from './VersePreview';

import Counter from 'src/components/dls/Counter/Counter';
import Select from 'src/components/dls/Forms/Select';
import Switch from 'src/components/dls/Switch/Switch';
import { getQuranReaderStylesInitialState } from 'src/redux/defaultSettings/util';
import {
  decreaseQuranTextFontScale,
  increaseQuranTextFontScale,
  MAXIMUM_FONT_STEP,
  MINIMUM_FONT_STEP,
  selectQuranReaderStyles,
  setQuranFont,
  setMushafLines,
} from 'src/redux/slices/QuranReader/styles';
import { logValueChange } from 'src/utils/eventLogger';
import { MushafLines, QuranFont } from 'types/QuranReader';

const QuranFontSection = () => {
  const dispatch = useDispatch();
  const { t, lang } = useTranslation('common');
  const quranReaderStyles = useSelector(selectQuranReaderStyles, shallowEqual);
  const { quranFont, quranTextFontScale, mushafLines } = quranReaderStyles;
  // when one of the view is selected, user can choose which font they want to use
  const fonts = useMemo(() => {
    return {
      [QuranFont.IndoPak]: [
        { id: QuranFont.IndoPak, label: t(`fonts.${QuranFont.IndoPak}`), value: QuranFont.IndoPak },
      ],
      [QuranFont.Tajweed]: [
        { id: QuranFont.Tajweed, label: t(`fonts.${QuranFont.Tajweed}`), value: QuranFont.Tajweed },
      ],
      [QuranFont.Uthmani]: [
        {
          id: QuranFont.MadaniV1,
          label: t(`fonts.${QuranFont.MadaniV1}`),
          value: QuranFont.MadaniV1,
          name: QuranFont.MadaniV1,
        },
        {
          id: QuranFont.MadaniV2,
          label: t(`fonts.${QuranFont.MadaniV2}`),
          value: QuranFont.MadaniV2,
          name: QuranFont.MadaniV2,
        },
        {
          id: QuranFont.QPCHafs,
          label: t(`fonts.${QuranFont.QPCHafs}`),
          value: QuranFont.QPCHafs,
          name: QuranFont.QPCHafs,
        },
      ],
    } as Record<QuranFont, { id: QuranFont; label: string; value: QuranFont; name: QuranFont }[]>;
  }, [t]);

  // given quranFont [all quran fonts variants], check whether it belongs to IndoPak or Uthmani
  // for example if it's QuranFont.MadaniV1, it belongs to QuranFont.Uthmani
  // if it's QuranFont.IndoPak, it belongs to QuranFont.IndoPak
  const getSelectedType = (font: QuranFont, locale: string) => {
    const selectedViewEntry = Object.entries(fonts).find(([, values]) =>
      values.some((v) => v.id === font),
    );
    if (selectedViewEntry) {
      const [view] = selectedViewEntry;
      return view;
    }
    // if no font is given, or invalid font is given, get type for default font
    return getSelectedType(getQuranReaderStylesInitialState(locale).quranFont, locale);
  };

  // get default font for selected type. We take the first font in this case
  // for example for QurantFont.Uthmani, it will be QuranFont.QPCHafs
  const getDefaultFont = (selectedType: QuranFont): QuranFont => {
    const [font] = fonts[selectedType];
    return font.value;
  };
  const selectedType = getSelectedType(quranFont, lang);
  const lines = useMemo(
    () =>
      Object.values(MushafLines).map((line) => ({
        id: line,
        label: t(`fonts.${line}`),
        value: line,
        name: line,
      })),
    [t],
  );

  const types = useMemo(
    () =>
      [QuranFont.Uthmani, QuranFont.IndoPak, QuranFont.Tajweed].map((font) => ({
        name: t(`fonts.${font}`),
        value: font,
      })),
    [t],
  );

  const onFontChange = (value: QuranFont) => {
    logValueChange('font_family', selectedType, value);
    dispatch(setQuranFont({ quranFont: getDefaultFont(value), locale: lang }));
  };

  const onFontStyleChange = (value: QuranFont) => {
    logValueChange('font_style', quranFont, value);
    dispatch(setQuranFont({ quranFont: value, locale: lang }));
  };

  const onMushafLinesChange = (value: MushafLines) => {
    logValueChange('mushaf_lines', mushafLines, value);
    dispatch(setMushafLines({ mushafLines: value, locale: lang }));
  };

  const onFontScaleDecreaseClicked = () => {
    logValueChange('font_scale', quranTextFontScale, quranTextFontScale - 1);
    dispatch(decreaseQuranTextFontScale());
  };

  const onFontScaleIncreaseClicked = () => {
    logValueChange('font_scale', quranTextFontScale, quranTextFontScale + 1);
    dispatch(increaseQuranTextFontScale());
  };

  return (
    <Section>
      <Section.Title>{t('fonts.quran-font')}</Section.Title>
      <Section.Row>
        <div className={styles.versePreviewContainer}>
          <VersePreview />
        </div>
      </Section.Row>
      <Section.Row>
        <Switch items={types} selected={selectedType} onSelect={onFontChange} />
      </Section.Row>
      <Section.Row>
        <Section.Label>{t('style')}</Section.Label>
        <Select
          id="quranFontStyles"
          name="quranFontStyles"
          options={fonts[selectedType]}
          value={quranFont}
          onChange={onFontStyleChange}
        />
      </Section.Row>
      {selectedType === QuranFont.IndoPak && (
        <Section.Row>
          <Section.Label>{t('fonts.lines')}</Section.Label>
          <Select
            id="lines"
            name="lines"
            options={lines}
            value={mushafLines}
            onChange={onMushafLinesChange}
          />
        </Section.Row>
      )}
      <Section.Row>
        <Section.Label>{t('fonts.font-size')}</Section.Label>
        <Counter
          count={quranTextFontScale}
          onDecrement={quranTextFontScale === MINIMUM_FONT_STEP ? null : onFontScaleDecreaseClicked}
          onIncrement={quranTextFontScale === MAXIMUM_FONT_STEP ? null : onFontScaleIncreaseClicked}
        />
      </Section.Row>
      <QuranFontSectionFooter quranFont={quranFont} />
    </Section>
  );
};

export default QuranFontSection;
