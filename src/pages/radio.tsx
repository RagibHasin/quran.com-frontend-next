import classNames from 'classnames';
import { GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';

import pageStyle from './index.module.scss';
import radioStyle from './radio.module.scss';

import { getAvailableReciters } from 'src/api';
import Footer from 'src/components/dls/Footer/Footer';
import NextSeoWrapper from 'src/components/NextSeoWrapper';
import CuratedStationList from 'src/components/Radio/CuratedStationList';
import ReciterStationList from 'src/components/Radio/ReciterStationList';
import { getLanguageAlternates } from 'src/utils/locale';
import { getCanonicalUrl } from 'src/utils/navigation';
import Reciter from 'types/Reciter';

type RadioPageProps = {
  reciters: Reciter[];
};
const RadioPage = ({ reciters }: RadioPageProps) => {
  const { t, lang } = useTranslation('');
  return (
    <div className={pageStyle.pageContainer}>
      <NextSeoWrapper
        title={t('common:quran-radio')}
        url={getCanonicalUrl(lang, '')}
        languageAlternates={getLanguageAlternates('')}
      />
      <div className={radioStyle.ribbon} />
      <div className={pageStyle.flow}>
        <div className={classNames(pageStyle.flowItem, radioStyle.title, radioStyle.titleOnRibbon)}>
          {t('radio:curated-stations')}
        </div>
        <div className={classNames(pageStyle.flowItem, pageStyle.fullWidth)}>
          <CuratedStationList />
        </div>
        <div className={classNames(pageStyle.flowItem, radioStyle.title)}>
          {t('radio:reciter-stations')}
        </div>
        <div className={classNames(pageStyle.flowItem, pageStyle.fullWidth)}>
          <ReciterStationList reciters={reciters} />
        </div>
      </div>

      <div className={classNames(pageStyle.flowItem, radioStyle.footerContainer)}>
        <Footer />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const { reciters } = await getAvailableReciters(locale, ['profile_picture']);
    return {
      props: {
        reciters,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default RadioPage;
