import React, {type ButtonHTMLAttributes} from 'react';
import {styled} from 'styled-components';
import {AvatarDao} from '../avatar';
import {ITagProps, Tag} from '@aragon/ods';

type CustomButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
>;
export type ListItemActionProps = CustomButtonProps & {
  /**
   * Parent background color
   */
  bgWhite?: boolean;
  /**
   * State that can be explicitly set by the client. These are mutually
   * exclusive. Default behaves like a normal UI element and will hover, focus,
   * etc. automatically. Disabled will disable the ui component, selected will
   * mark it selected.
   */
  mode?: 'default' | 'disabled' | 'selected';
  /**
   * Bold text, left aligned. Mandatory
   */
  title: string;
  tag?: ITagProps;
  /**
   * WalletConnect logo. Optional. Displayed inline with the title.
   */
  wcLogo?: boolean;
  /**
   * Normal font, small. Optional. Displayed below the title, left aligned
   */
  subtitle?: string;
  /** Left aligned. Both left and right icon can be present simultaneously */
  iconLeft?: React.ReactElement | string;
  /** Right aligned. Both left and right icon can be present simultaneously */
  iconRight?: React.ReactElement;
  truncateText?: boolean;
};

export const ListItemAction: React.FC<ListItemActionProps> = ({
  title,
  subtitle,
  iconLeft,
  iconRight,
  tag,
  wcLogo,
  mode = 'default',
  truncateText = false,
  ...props
}) => {
  return (
    <Container {...props} mode={mode} data-testid="listItem-action">
      <LeftContent>
        <RenderIconLeft icon={iconLeft} label={title} />
        {/* This could be done with label. However, I can't get the label's text
         to inherit the color (for example, when selected mode is on) */}
        <LabelContainer>
          <div className="flex items-center gap-x-1">
            <p
              className={`font-semibold ft-text-base ${
                truncateText ? 'truncate' : ''
              }`}
            >
              {title}
            </p>

            {tag && <Tag {...tag} />}
            {wcLogo && (
              <span>
                <WalletConnectLogoMini />
              </span>
            )}
          </div>
          {subtitle && (
            <p
              className={`text-neutral-500 ft-text-sm ${
                truncateText ? 'truncate' : ''
              }`}
            >
              {subtitle}
            </p>
          )}
        </LabelContainer>
      </LeftContent>
      {iconRight && <span>{iconRight}</span>}
    </Container>
  );
};

// NOTE: Temporary, to be refactored with new version of ODS
const RenderIconLeft: React.FC<{
  icon?: ListItemActionProps['iconLeft'];
  label?: string;
}> = ({icon, label}) => {
  if (!icon) {
    return null;
  }

  return typeof icon === 'string' ? (
    <AvatarDao daoName={label ?? icon} src={icon} size="small" />
  ) : (
    <span>{icon}</span>
  );
};

type InputContainerProps = Pick<ListItemActionProps, 'mode' | 'bgWhite'>;

const Container = styled.button.attrs<InputContainerProps>(
  ({mode, bgWhite = false}) => {
    const baseLayoutClasses = 'flex items-center gap-x-3 w-full';
    const baseStyleClasses =
      'py-3 px-4 rounded-xl font-normal border-2 border-[transparent]';
    let className:
      | string
      | undefined = `${baseLayoutClasses} ${baseStyleClasses}`;

    switch (mode) {
      case 'disabled':
        className += ' text-neutral-300';
        className += bgWhite ? ' bg-neutral-0' : ' bg-neutral-50';
        break;
      case 'selected':
        className += ' text-primary-500 border-primary-500';
        className += bgWhite ? ' bg-primary-50' : ' bg-neutral-0';
        break;
      default:
        {
          const focusClasses =
            'focus:outline-none focus-visible:ring focus-visible:ring-primary';
          const hoverClasses = 'hover:text-primary-500';
          let activeClasses = 'active:outline-none active:ring-0';
          activeClasses += bgWhite
            ? ' active:bg-primary-50'
            : ' active:bg-neutral-0';

          className += bgWhite ? ' bg-neutral-0' : ' bg-neutral-50';
          className += ` text-neutral-600 ${activeClasses} ${focusClasses} ${hoverClasses}`;
        }
        break;
    }
    const disabled: boolean | undefined = mode === 'disabled';
    return {className, disabled};
  }
)<InputContainerProps>``;

const LabelContainer = styled.div.attrs({
  className: 'text-left overflow-hidden',
})``;
const LeftContent = styled.div.attrs({
  className: 'flex items-center space-x-3 flex-1 overflow-hidden',
})``;

const WalletConnectLogoMini = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className="h-5"
      fill="currentColor"
    >
      <path
        d="M3.276 5.05c2.609-2.521 6.84-2.521 9.449 0l.314.304c.13.126.13.33 0 .457l-1.075 1.038a.171.171 0 0 1-.236 0l-.432-.417c-1.82-1.76-4.772-1.76-6.592 0l-.463.447a.171.171 0 0 1-.236 0L2.931 5.841a.315.315 0 0 1 0-.457l.345-.333Zm11.67 2.148.956.924c.13.126.13.33 0 .457l-4.31 4.167a.342.342 0 0 1-.473 0L8.059 9.79a.086.086 0 0 0-.118 0l-3.06 2.957a.342.342 0 0 1-.472 0L.098 8.58a.315.315 0 0 1 0-.457l.956-.924a.342.342 0 0 1 .472 0l3.06 2.958a.086.086 0 0 0 .118 0l3.06-2.958a.342.342 0 0 1 .472 0l3.06 2.958a.086.086 0 0 0 .118 0l3.06-2.958a.342.342 0 0 1 .472 0Z"
        fill="currentColor"
      />
    </svg>
  );
};
