import { useRef, useState } from 'react';

import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

import ChatIcon from '../../../../public/icons/chat.svg';

import styles from './TranslationViewCell.module.scss';

import Button, { ButtonShape, ButtonSize, ButtonVariant } from 'src/components/dls/Button/Button';
import ContentModal from 'src/components/dls/ContentModal/ContentModal';
import { logButtonClick } from 'src/utils/eventLogger';
import { getVerseSelectedReflectionNavigationUrl } from 'src/utils/navigation';

type QuranReflectButtonProps = {
  verseKey: string;
  isTranslationView?: boolean;
  onActionTriggered?: () => void;
};

const QuranReflectButton = ({
  verseKey,
  isTranslationView = true,
  onActionTriggered,
}: QuranReflectButtonProps) => {
  const { t } = useTranslation('common');
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  const onButtonClicked = () => {
    // eslint-disable-next-line i18next/no-literal-string
    logButtonClick(`${isTranslationView ? 'translation_view' : 'reading_view'}_reflect`);
    setIsContentModalOpen(true);
    // navigateToExternalUrl(getQuranReflectVerseUrl(verseKey));
    if (onActionTriggered) {
      onActionTriggered();
    }
  };

  const contentModalRef = useRef(null);

  const onModalClose = () => {
    setIsContentModalOpen(false);
  };

  return (
    <>
      <Button
        variant={ButtonVariant.Ghost}
        onClick={onButtonClicked}
        size={ButtonSize.Small}
        tooltip={t('reflect')}
        shouldFlipOnRTL={false}
        shape={ButtonShape.Circle}
        className={classNames(styles.iconContainer, styles.verseAction)}
      >
        <span className={styles.icon}>
          <ChatIcon />
        </span>
      </Button>
      <ContentModal
        innerRef={contentModalRef}
        url={getVerseSelectedReflectionNavigationUrl(verseKey)}
        isOpen={isContentModalOpen}
        hasCloseButton
        onClose={onModalClose}
        onEscapeKeyDown={onModalClose}
        header={<div />}
      >
        <div>a</div>
      </ContentModal>
    </>
  );
};

export default QuranReflectButton;
