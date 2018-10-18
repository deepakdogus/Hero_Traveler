import React from 'react'
import styled from 'styled-components'
import Footer from './Footer'

const ContentWrapper = styled.div`
  margin: 65px 7% 0;
`

const LimitedWidthContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 65px;
`

const Title = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 700;
  font-size: 38px;
  line-height: 50px;
  color: ${props => props.theme.Colors.background};
`

const BodyText = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 0.7px;S
`

const StyledHeaderText = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  &:first-letter: {
    text-transform: uppercase;
  }
`

const StyledOffsiteLink = styled.a`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-decoration: none;
`

const PrivacyScreen = () => (
  <ContentWrapper>
    <LimitedWidthContainer>
      <Title>Privacy Policy</Title>
      <BodyText>
        It is key to Hero Traveler (the “Website”) that the privacy of all of its uses is taken very
        seriously. This Privacy Policy outlines the information the Website collects and how such
        collected information is used. You can always contact us at{' '}
        <StyledOffsiteLink href="mailto:support@herotraveler.com">
          support@herotraveler.com
        </StyledOffsiteLink>{' '}
        any time in the event you have any questions regarding our Privacy Policy.
      </BodyText>
      <StyledHeaderText>Terms of Service</StyledHeaderText>
      <BodyText>
        Please refer to our Terms of Service for a clear explanation of all legal terms and
        provisions, limitation of liability, disclaimer of implied warranties, use and content, use
        of services and user forums, and copyright infringement.
      </BodyText>
      <StyledHeaderText>Collection of Information and How Hero Traveler Uses It</StyledHeaderText>
      <BodyText>
        The Website requires users to register for the service and provide personal information
        including but not limited to the user's name, zip code and email address. The Website uses
        this information to establish and deliver service to the individual. The Website may use
        this information to contact registered users to notify them of product and service updates,
        provide instruction, and to deliver other service related information. The Website may also
        contact users to request additional information and feedback. The Website may employ
        companies and people to perform tasks on its behalf, and will need to share personal
        information with these agents to establish and deliver service to the individual. The
        Website agents do not receive any right to use personal information beyond what is necessary
        to perform these tasks.
      </BodyText>
      <BodyText>
        The Website will not disclose registration information to third parties, including, but not
        limited to companies affiliated with the Website, without your consent or as otherwise
        stated in this privacy policy. If at some point the Website sells all or a portion of its
        assets, customer information is one of those assets that would be transferred or acquired by
        a third party; the third party would then have the right to continue using the personal
        information as set forth in this policy. For more information see the Website’s Privacy
        Policy Changes section below.
      </BodyText>
      <BodyText>
        The Website may release or exchange personal information if required to do so to comply with
        applicable laws or to enforce its rights or agreements or prevent fraud or reduce credit
        risk. In addition, the Website may contact you to inform you of updates or new features. If
        you wish to be removed from such secondary mailings you may do so by the means provided in
        the email.
      </BodyText>
      <BodyText>
        The Website may automatically collect and analyze information regarding the use of the
        Website's services and the Website activity. Information collected may include but is not
        limited to web site traffic volume, frequency of visits, type and time of transactions, type
        of browser and operating system, etc. This information is logged to help diagnose technical
        problems, administer the site, and improve the quality and types of service delivered. The
        Website may also collect, track and analyze information that does not personally identify a
        user in aggregate form. This aggregate data will be used at the Website's discretion and may
        be shared with third parties, but with no personally identifiable information attached.
        Registered users will be using the site to host relationship data. Relationship data sent to
        the Website’s servers by the user will remain the property of the user. The Website will not
        review, share, distribute or reference such data except as may be required to provide the
        requested Webiste services, or as provided in the Website Terms of Use Agreement, or as may
        be required by law.
      </BodyText>
      <BodyText>
        If a user's personally identifiable information changes (such as zip code or email), or if a
        user no longer desires our service, we provide a way to correct, update or delete/deactivate
        users' personally identifiable information. If not easily available online, this can be done
        by emailing our customer support at{' '}
        <StyledOffsiteLink href="mailto:support@herotraveler.com">
          support@herotraveler.com
        </StyledOffsiteLink>
        .
      </BodyText>
      <StyledHeaderText>Cookies and Beacons</StyledHeaderText>
      <BodyText>
        The Website uses cookies and beacons from time to time to assist in delivering the service
        and to provide a positive and personalized user experience. Cookies are files sent to your
        browser from a web server and stored on your computer's hard drive. Our persistent and
        session ID Cookies are used to identify unique visitors and to provide a personalized user
        experience. Beacons are bits of code that function similar to cookies. Our beacons are
        embedded in outgoing emails and generate a call back to the Webiste server when such emails
        are opened. The Website uses beacons to track the status of sent emails.
      </BodyText>
      <StyledHeaderText>Security</StyledHeaderText>
      <BodyText>
        The Website has implemented processes designed to protect user information and maintain
        security. Each registered user is assigned a unique user name and password which is required
        to access their account and relationship information. It is the user's responsibility to
        protect the security of their login information. The Website’s servers are located in secure
        server environments. Firewalls and other advanced security technologies are employed to
        prevent interference or access from outside intruders. These safeguards help prevent
        unauthorized access, maintain data accuracy, and ensure the appropriate use of data.
      </BodyText>
      <StyledHeaderText>Third Party Sites</StyledHeaderText>
      <BodyText>
        The Website may contain links to third party web sites not associated with the Website. The
        Website is not responsible for the privacy practices or content of such sites. Users will
        need to review the policy statements of these sites to understand their privacy policies.
      </BodyText>
      <StyledHeaderText>Privacy Policy Changes</StyledHeaderText>
      <BodyText>
        The Website reserves the right to make changes to this privacy statement. Any material
        changes to this statement will be prominently posted online and accessible via the Website
        user portal 30 days prior to taking effect.
      </BodyText>
    </LimitedWidthContainer>
    <Footer />
  </ContentWrapper>
)

export default PrivacyScreen
