import React from 'react'
import {
  ScrollView,
  View,
  Text
} from 'react-native'

import {Colors} from '../Themes'
import styles from './Styles/TermsAndConditionsScreenStyles'

export default class TermsAndConditionsScreen extends React.Component {
  render () {
    return (
      <ScrollView style={styles.scrollViewWrapper}>
          <Text style={styles.titleText}>
            Terms of Use
          </Text>
          <Text style={styles.subtitleText}>
            (LAST UPDATED July 22ND, 2016)
          </Text>
          <Text style={styles.bodyText}>
            By accessing or using the Hero Traveler website, the Hero Traveler service, or any applications (including mobile applications) made available by Hero Traveler (together, the “service”), however accessed, you agree to be bound by these terms of use. (“Terms of Use”). The service is owned or controlled by Hero Traveler, INC (“Hero Traveler”) These Terms of Use affect your legal rights and obligations. If you do not agree to be bound by all of these Terms of Use, do not access or use the Service.
          </Text>
          <Text style={styles.bodyText}>
            By accessing the Hero Traveler Service and/or by clicking "I agree", you agree to be bound by these Terms of Use. You hereby represent and warrant to Hero Traveler that you are at least eighteen (18) years of age or and otherwise capable of entering into and performing legal agreements, and that you agree to be bound by the following Terms and Conditions. If you use the Hero Traveler Service on behalf of a business, you hereby represent to Hero Traveler that you have the authority to bind that business and your acceptance of these Terms of Use will be treated as acceptance by that business. In that event, "you" and "your" will refer to that business in these Terms of Use.
          </Text>
          <Text style={styles.bodyText}>
              When using the Hero Traveler Service, you will be subject to any additional posted policies, guidelines or rules applicable to specific services and features which may be posted from time to time (the "Policies"). All such Policies are hereby incorporated by reference into these Terms. In the case of any inconsistency between these Terms of Service and any other document that has been incorporated by reference herein, these Terms of Service shall control.
          </Text>
          <Text style={styles.bodyText}>
              There may be times when we offer a special feature that has its own terms and conditions that apply in addition to these Terms of Use. In those cases, the terms specific to the feature control to the extent there is a conflict with these Terms of Use.
          </Text>
          <Text style={styles.bodyText}>
            ARBITRATION NOTICE: EXCEPT IF YOU OPT-OUT AND EXCEPT FOR CERTAIN TYPES OF DISPUTES DESCRIBED IN THE ARBITRATION SECTION BELOW, YOU AGREE THAT DISPUTES BETWEEN YOU AND INSTAGRAM WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION. YOU AGREE THAT ANY CLAIM YOU MAY HAVE ARISING OUT OF OR RELATED TO YOUR RELATIONSHIP WITH HERO TRAVELER MUST BE FILED WITHONE ONE YEAR AFTER SUCH CLAIM AROSE; OTHERWISE YOUR CLAIM IS PERMAMNENTLY BARRED.
          </Text>
          <Text style={styles.headerText}>
            Arbitration
          </Text>
          <Text style={styles.bodyText}>
            Except if you opt-out or for disputes relating to: (1) your or Hero Traveler's 's intellectual property (such as trademarks, trade dress, domain names, trade secrets, copyrights and patents); (2) violations of the API Terms; or (3) violations of provisions 13 or 15 of the Basic Terms, above ("Excluded Disputes"), you agree that all disputes between you and Hero Traveler's (whether or not such dispute involves a third party) with regard to your relationship with Hero Traveler's, including without limitation disputes related to these Terms of Use, your use of the Service, and/or rights of privacy and/or publicity, will be resolved by binding, individual arbitration under the American Arbitration Association's rules for arbitration of consumer-related disputes and you and Hero Traveler's hereby expressly waive trial by jury. As an alternative, you may bring your claim in your local "small claims" court, if permitted by that small claims court's rules. You may bring claims only on your own behalf. Neither you nor Hero Traveler's will participate in a class action or class-wide arbitration for any claims covered by this agreement. You also agree not to participate in claims brought in a private attorney general or representative capacity, or consolidated claims involving another person's account, if Hero Traveler's is a party to the proceeding. This dispute resolution provision will be governed by the Federal Arbitration Act. In the event the American Arbitration Association is unwilling or unable to set a hearing date within one hundred and sixty (160) days of filing the case, then either Hero Traveler's or you can elect to have the arbitration administered instead by the Judicial Arbitration and Mediation Services. Judgment on the award rendered by the arbitrator may be entered in any court having competent jurisdiction. Any provision of applicable law notwithstanding, the arbitrator will not have authority to award damages, remedies or awards that conflict with these Terms of Use.
          </Text>
          <Text style={styles.bodyText}>
            You may opt out of this agreement to arbitrate. If you do so, neither you nor Hero Travelers can require the other to participate in an arbitration proceeding. To opt out, you must notify Instagram in writing within 30 days of the date that you first became subject to this arbitration provision. You must use this address to opt out:
          </Text>
          <Text style={styles.bodyText}>
            Hero Traveler's, LLC ATTN: 44 West 28th street.  New York, NY 10010
          </Text>
          <Text style={styles.bodyText}>
            You must include your name and residence address, the email address you use for your Hero Traveler's account, and a clear statement that you want to opt out of this arbitration agreement.
          </Text>
          <Text style={styles.bodyText}>
            If the prohibition against class actions and other claims brought on behalf of third parties contained above is found to be unenforceable, then all of the preceding language in this Arbitration section will be null and void. This arbitration agreement will survive the termination of your relationship with Hero Traveler's.
          </Text>
          <Text style={styles.headerText}>
            Basic Terms
          </Text>
          <Text style={styles.OLbodyText}>
            1.  You must be at least 13 years old to use the Service.
          </Text>
          <Text style={styles.OLbodyText}>
            2.  You may not post violent, nude, partially nude, discriminatory, unlawful, infringing, hateful, pornographic or sexually suggestive photos or other content via the Service.
          </Text>
          <Text style={styles.OLbodyText}>
            3.  You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, followers, username, or any account rights. With the exception of people or businesses that are expressly authorized to create accounts on behalf of their employers or clients, Instagram prohibits the creation of and you agree that you will not create an account for anyone other than yourself. You also represent that all information you provide or provided to Instagram upon registration and at all other times will be true, accurate, current and complete and you agree to update your information as necessary to maintain its truth and accuracy.
          </Text>
          <Text style={styles.OLbodyText}>
            4.  You agree that you will not solicit, collect or use the login credentials of other Instagram users.
          </Text>
          <Text style={styles.OLbodyText}>
            5.  You are responsible for keeping your password secret and secure.
          </Text>
          <Text style={styles.OLbodyText}>
            6.  You must not defame, stalk, bully, abuse, harass, threaten, impersonate or intimidate people or entities and you must not post private or confidential information via the Service, including, without limitation, your or any other person's credit card information, social security or alternate national identity numbers, non-public phone numbers or non-public email addresses.
          </Text>
          <Text style={styles.OLbodyText}>
            7.  You may not use the Service for any illegal or unauthorized purpose. You agree to comply with all laws, rules and regulations (for example, federal, state, local and provincial) applicable to your use of the Service and your Content (defined below), including but not limited to, copyright laws.
          </Text>
          <Text style={styles.OLbodyText}>
            8.  You are solely responsible for your conduct and any data, text, files, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, links and other content or materials (collectively, "Content") that you submit, post or display on or via the Service.
          </Text>
          <Text style={styles.OLbodyText}>
            9.  You must not change, modify, adapt or alter the Service or change, modify or alter another website so as to falsely imply that it is associated with the Service or Instagram.
          </Text>
          <Text style={styles.OLbodyText}>
            10. You must not access Hero Traveler's private API by means other than those permitted by Instagram. Use of Hero Traveler 's API is subject to a separate set of terms available here: (insert link to ("API Terms").
          </Text>
          <Text style={styles.OLbodyText}>
            11. You must not create or submit unwanted email, comments, likes or other forms of commercial or harassing communications (a/k/a "spam") to any Hero Traveler users.
          </Text>
          <Text style={styles.OLbodyText}>
            12. You must not use domain names or web URLs in your username without prior written consent from Hero Traveler.
          </Text>
          <Text style={styles.OLbodyText}>
            13. You must not interfere or disrupt the Service or servers or networks connected to the Service, including by transmitting any worms, viruses, spyware, malware or any other code of a destructive or disruptive nature. You may not inject content or code or otherwise alter or interfere with the way any Instagram page is rendered or displayed in a user's browser or device.
          </Text>
          <Text style={styles.OLbodyText}>
            14. You must not create accounts with the Service through unauthorized means, including but not limited to, by using an automated device, script, bot, spider, crawler or scraper.
          </Text>
          <Text style={styles.OLbodyText}>
            15. You must not attempt to restrict another user from using or enjoying the Service and you must not encourage or facilitate violations of these Terms of Use or any other Instagram terms.
          </Text>
          <Text style={styles.OLbodyText}>
            16. Violation of these Terms of Use may, in Instagram's sole discretion, result in termination of your Instagram account. You understand and agree that Instagram cannot and will not be responsible for the Content posted on the Service and you use the Service at your own risk. If you violate the letter or spirit of these Terms of Use, or otherwise create risk or possible legal exposure for Instagram, we can stop providing all or part of the Service to you.
          </Text>
          <Text style={styles.headerText}>
            General Conditions
          </Text>
          <Text style={styles.OLbodyText}>
            1.  Hero Traveler reserves the right, at Hero Traveler’ discretion, to change, modify, add, or remove portions of these Terms at any time by posting the amended Terms to the Hero Traveler Service. Please check these Terms and any Policies periodically for changes. Your continued use of the Hero Traveler Service after the posting of changes constitutes your binding acceptance of such changes. Except as stated elsewhere, such amended Terms or fees will automatically be effective twenty (20) days after they are initially posted on the Hero Traveler Service.
          </Text>
          <Text style={styles.OLbodyText}>
            2.  We reserve the right to modify or terminate the Service or your access to the Service for any reason, without notice, at any time, and without liability to you. You can deactivate your Hero Traveler account by logging into the Service and completing the form available. If we terminate your access to the Service or you use the form to deactivate your account, your photos, comments, videos, likes, friendships, itineraries and all other data will no longer be accessible through your account (e.g., users will not be able to navigate to your username and view your photos), but those materials and data may persist and appear within the Service (e.g., if your Content has been re-shared by others).
          </Text>
          <Text style={styles.OLbodyText}>
            3.  Upon termination, all licenses and other rights granted to you in these Terms of Use will immediately cease.
          </Text>
          <Text style={styles.OLbodyText}>
            4.  We reserve the right, in our sole discretion, to change these Terms of Use ("Updated Terms") from time to time. Unless we make a change for legal or administrative reasons, we will provide reasonable advance notice before the Updated Terms become effective. You agree that we may notify you of the Updated Terms by posting them on the Service, and that your use of the Service after the effective date of the Updated Terms (or engaging in such other conduct as we may reasonably specify) constitutes your agreement to the Updated Terms. Therefore, you should review these Terms of Use and any Updated Terms before using the Service. The Updated Terms will be effective as of the time of posting, or such later date as may be specified in the Updated Terms, and will apply to your use of the Service from that point forward. These Terms of Use will govern any disputes arising before the effective date of the Updated Terms.
          </Text>
          <Text style={styles.OLbodyText}>
            5.  We reserve the right to force forfeiture of any username for any reason.
          </Text>
          <Text style={styles.OLbodyText}>
            6.  We may, but have no obligation to, remove, edit, block, and/or monitor Content or accounts containing Content that we determine in our sole discretion violates these Terms of Use.
          </Text>
          <Text style={styles.OLbodyText}>
            7.  You are solely responsible for your interaction with other users of the Service, whether online or offline. You agree that Hero Traveler is not responsible or liable for the conduct of any user. Hero Traveler reserves the right, but has no obligation, to monitor or become involved in disputes between you and other users. Exercise common sense and your best judgment when interacting with others, including when you submit or post Content or any personal or other information.
          </Text>
          <Text style={styles.OLbodyText}>
            8.  There may be links from the Service, or from communications you receive from the Service, to third-party web sites or features. There may also be links to third-party web sites or features in images or comments within the Service. The Service also includes third-party content that we do not control, maintain or endorse. Functionality on the Service may also permit interactions between the Service and a third-party web site or feature, including applications that connect the Service or your profile on the Service with a third-party web site or feature. For example, the Service may include a feature that enables you to share Content from the Service or your Content with a third party, which may be publicly posted on that third party's service or application. Using this functionality typically requires you to login to your account on the third-party service and you do so at your own risk. Hero Traveler does not control any of these third-party web services or any of their content. You expressly acknowledge and agree that Hero Traveler is in no way responsible or liable for any such third-party services or features. YOUR CORRESPONDENCE AND BUSINESS DEALINGS WITH THIRD PARTIES FOUND THROUGH THE SERVICE ARE SOLELY BETWEEN YOU AND THE THIRD PARTY. You may choose, at your sole and absolute discretion and risk, to use applications that connect the Service or your profile on the Service with a third-party service (each, an "Application") and such Application may interact with, connect to or gather and/or pull information from and to your Service profile. By using such Applications, you acknowledge and agree to the following: (i) if you use an Application to share information, you are consenting to information about your profile on the Service being shared; (ii) your use of an Application may cause personally identifying information to be publicly disclosed and/or associated with you, even if Hero Traveler has not itself provided such information; and (iii) your use of an Application is at your own option and risk, and you will hold the Hero Traveler Parties (defined below) harmless for activity related to the Application.
          </Text>
          <Text style={styles.OLbodyText}>
            9.  You agree that you are responsible for all data charges you incur through use of the Service.
          </Text>
          <Text style={styles.OLbodyText}>
            10. We prohibit crawling, scraping, caching or otherwise accessing any content on the Service via automated means, including but not limited to, user profiles and photos (except as may be the result of standard search engine protocols or technologies used by a search engine with Instagram's express consent).
          </Text>
          <Text style={styles.headerText}>
            Rights
          </Text>
          <Text style={styles.OLbodyText}>
            1.  Hero Traveler does not claim ownership of any Content that you post on or through the Service. Instead, you hereby grant to Hero Traveler a non-exclusive, fully paid and royalty-free, transferable, sub-licensable, worldwide license to use the Content that you post on or through the Service, subject to the Service's Privacy Policy, including but not limited to sections 3 ("Sharing of Your Information"), 4 ("How We Store Your Information"), and 5 ("Your Choices About Your Information"). You can choose who can view your Content and activities, including your photos, as described in the Privacy Policy.
          </Text>
          <Text style={styles.OLbodyText}>
            2.  Some of the Service is supported by advertising revenue and may display advertisements and promotions, and you hereby agree that Instagram may place such advertising and promotions on the Service or on, about, or in conjunction with your Content. The manner, mode and extent of such advertising and promotions are subject to change without specific notice to you.
          </Text>
          <Text style={styles.OLbodyText}>
            3.  You acknowledge that we may not always identify paid services, sponsored content, or commercial communications as such.
          </Text>
          <Text style={styles.OLbodyText}>
            4.  You represent and warrant that: (i) you own the Content posted by you on or through the Service or otherwise have the right to grant the rights and licenses set forth in these Terms of Use; (ii) the posting and use of your Content on or through the Service does not violate, misappropriate or infringe on the rights of any third party, including, without limitation, privacy rights, publicity rights, copyrights, trademark and/or other intellectual property rights; (iii) you agree to pay for all royalties, fees, and any other monies owed by reason of Content you post on or through the Service; and (iv) you have the legal right and capacity to enter into these Terms of Use in your jurisdiction.
          </Text>
          <Text style={styles.OLbodyText}>
            5.  The Service contains content owned or licensed by Instagram ("Hero Traveler Content"). Hero Traveler Content is protected by copyright, trademark, patent, trade secret and other laws, and, as between you and Instagram, Hero Traveler owns and retains all rights in the Hero Traveler Content and the Service. You will not remove, alter or conceal any copyright, trademark, service mark or other proprietary rights notices incorporated in or accompanying the Hero Traveler Content and you will not reproduce, modify, adapt, prepare derivative works based on, perform, display, publish, distribute, transmit, broadcast, sell, license or otherwise exploit the Hero Traveler Content.
          </Text>
          <Text style={styles.OLbodyText}>
            6.  The Hero Traveler name and logo are trademarks of Hero Traveler, and may not be copied, imitated or used, in whole or in part, without the prior written permission of Hero Traveler, except in accordance with our brand guidelines, available here: __________________. In addition, all page headers, custom graphics, button icons and scripts are service marks, trademarks and/or trade dress of Instagram, and may not be copied, imitated or used, in whole or in part, without prior written permission from I Hero Traveler.
          </Text>
          <Text style={styles.OLbodyText}>
            7.  Although it is Hero Traveler 's intention for the Service to be available as much as possible, there will be occasions when the Service may be interrupted, including, without limitation, for scheduled maintenance or upgrades, for emergency repairs, or due to failure of telecommunications links and/or equipment. Also, Hero Traveler reserves the right to remove any Content from the Service for any reason, without prior notice. Content removed from the Service may continue to be stored by Hero Traveler, including, without limitation, in order to comply with certain legal obligations, but may not be retrievable without a valid court order. Consequently, Hero Traveler encourages you to maintain your own backup of your Content. In other words, Hero Traveler is not a backup service and you agree that you will not rely on the Service for the purposes of Content backup or storage. Hero Traveler will not be liable to you for any modification, suspension, or discontinuation of the Services, or the loss of any Content. You also acknowledge that the Internet may be subject to breaches of security and that the submission of Content or other information may not be secure.
          </Text>
          <Text style={styles.OLbodyText}>
            8.  You agree that Hero Traveler is not responsible for, and does not endorse, Content posted within the Service. Hero Traveler does not have any obligation to prescreen, monitor, edit, or remove any Content. If your Content violates these Terms of Use, you may bear legal responsibility for that Content.
          </Text>
          <Text style={styles.OLbodyText}>
            9.  Except as otherwise described in the Service's Privacy Policy, available at http://herotraveler/legal/privacy/, as between you and Hero Traveler, any Content will be non-confidential and non-proprietary and we will not be liable for any use or disclosure of Content. You acknowledge and agree that your relationship with Instagram is not a confidential, fiduciary, or other type of special relationship, and that your decision to submit any Content does not place Hero Traveler in a position that is any different from the position held by members of the general public, including with regard to your Content. None of your Content will be subject to any obligation of confidence on the part of Hero Traveler, and Hero Traveler will not be liable for any use or disclosure of any Content you provide.
          </Text>
          <Text style={styles.OLbodyText}>
            10. It is Hero Traveler 's policy not to accept or consider content, information, ideas, suggestions or other materials other than those we have specifically requested and to which certain specific terms, conditions and requirements may apply. This is to avoid any misunderstandings if your ideas are similar to those we have developed or are developing independently. Accordingly, Hero Traveler does not accept unsolicited materials or ideas, and takes no responsibility for any materials or ideas so transmitted. If, despite our policy, you choose to send us content, information, ideas, suggestions, or other materials, you further agree that Hero Traveler is free to use any such content, information, ideas, suggestions or other materials, for any purposes whatsoever, including, without limitation, developing and marketing products and services, without any liability or payment of any kind to you.
          </Text>
          <Text style={styles.headerText}>
            Governing Law & Venue
          </Text>
          <Text style={styles.bodyText}>
            These Terms of Use are governed by and construed in accordance with the laws of the State of New York, without giving effect to any principles of conflicts of law AND WILL SPECIFICALLY NOT BE GOVERNED BY THE UNITED NATIONS CONVENTIONS ON CONTRACTS FOR THE INTERNATIONAL SALE OF GOODS, IF OTHERWISE APPLICABLE. For any action at law or in equity relating to the arbitration provision of these Terms of Use, the Excluded Disputes or if you opt out of the agreement to arbitrate, you agree to resolve any dispute you have with Hero Traveler's exclusively in a state or federal court located in New York, NY.
          </Text>
          <Text style={styles.bodyText}>
            If any provision of these Terms of Use is held to be unlawful, void, or for any reason unenforceable during arbitration or by a court of competent jurisdiction, then that provision will be deemed severable from these Terms of Use and will not affect the validity and enforceability of any remaining provisions. Hero Traveler's 's failure to insist upon or enforce strict performance of any provision of these Terms will not be construed as a waiver of any provision or right. No waiver of any of these Terms will be deemed a further or continuing waiver of such term or condition or any other term or condition. Hero Traveler's reserves the right to change this dispute resolution provision, but any such changes will not apply to disputes arising before the effective date of the amendment. This dispute resolution provision will survive the termination of any or all of your transactions with Instagram.
          </Text>
          <Text style={styles.OLbodyText}>
            1.  If your issue isn't related to Intellectual Property, please see one of the related issues below:
          </Text>
          <Text style={styles.OLbodyText}>
            2.  If you repeatedly infringe other people's intellectual property rights, we will disable your account when appropriate.
          </Text>
          <Text style={styles.headerText}>
            1. Ownership of Materials; Limited License
          </Text>
          <Text style={styles.OLbodyText}>
            <Text style={styles.bodyNumberText}>1.1</Text> The data and materials on the Hero Traveler Service, except the Produced Content (as defined below), including, without limitation, the text, graphics, interactive features, logos, photos, music, videos, software, and all other audible, visual or downloadable materials, as well as the selection, organization, coordination, compilation and overall look and feel of the Hero Traveler Service (collectively, the "Materials") are the intellectual property of Hero Traveler, its licensors and its suppliers. The Materials are protected by copyright, trade dress, patent, trademark and other laws, international conventions and proprietary rights and all ownership rights to the Materials remain with Hero Traveler, its licensors or its suppliers, as the case may be. All trademarks, service marks, and trade names are proprietary to Hero Traveler or its affiliates and/or third party licensors. Except as expressly authorized by Hero Traveler, You agree not to sell, license, distribute, copy, modify, publicly perform or display, transmit, publish, edit, adapt, create derivative works from, or otherwise make use of the Materials. If, with authorization, you download or print a copy of the Materials for personal use, you must retain all copyright, trademark, or other proprietary notices. Hero Traveler reserves all rights not expressly granted in and to the Hero Traveler Service and the Materials.
          </Text>
          <Text style={styles.OLbodyText}>
            <Text style={styles.bodyNumberText}>1.2</Text> Subject to your compliance with the terms and conditions set out in these Terms, Hero Traveler hereby grants you a personal, limited, non-exclusive, non-transferable, freely revocable license to use the Hero Traveler Service for the non-commercial viewing of content (as defined below).
          </Text>
          <Text style={styles.headerText}>
            3. Produced Content
          </Text>
          <Text style={styles.OLbodyText}>
            <Text style={styles.bodyNumberText}>3.1</Text> The Hero Traveler Service permits its Users to create, upload and/or display content of their own creations, including audiovisual Content, written works, video, posted on message boards, chat and blogs, and any other content, including without limitation, videos, music, images, and text (collectively, "Produced Content").
          </Text>
          <Text style={styles.OLbodyText}>
            <Text style={styles.bodyNumberText}>3.2</Text> You understand that when using the Hero Traveler Service, you will be exposed to Produced Content from a variety of sources, and that Hero Traveler is not responsible for the accuracy, usefulness, safety, or intellectual property rights of or relating to such Produced Content or other content. You further understand and acknowledge that you may be exposed to Produced Content that is inaccurate, offensive, indecent, or objectionable, and you agree to waive, and hereby do waive, any legal or equitable rights or remedies you have or may have against Hero Traveler with respect thereto. Hero Traveler does not endorse any Produced Content or any opinion, recommendation, or advice expressed therein, and Hero Traveler expressly disclaims any and all liability in connection with the Produced Content. YOU AGREE TO WAIVE, AND HEREBY DO WAIVE, ANY LEGAL OR EQUITABLE RIGHTS OR REMEDIES YOU HAVE OR MAY HAVE AGAINST ARTISTFAN, LLC WITH RESPECT THERETO AND AGREE TO INDEMNIFY AND HOLD ARTISTFAN, LLC, ITS OWNERS/OPERATORS, AFFILIATES, SUPPLIERS, AND/OR LICENSORS HARMLESS TO THE FULLEST EXTENT ALLOWED BY LAW REGARDING ALL MATTERS RELATED TO YOUR CONTENT AND END USER CONTENT AND USE OF THE ARTISTFAN SERVICE.
          </Text>
          <Text style={styles.OLbodyText}>
            <Text style={styles.bodyNumberText}>3.3</Text> Hero Traveler permits you to link to the Hero Traveler Service for personal, non-commercial purposes only.
          </Text>
          <Text style={styles.headerText}>
            4. Prohibited Uses
          </Text>
          <Text style={styles.bodyText}>
            YOU HEREBY REPRESENT AND WARRANT THAT YOU WILL NOT (AND THE FOLLOWING SHALL SOMETIMES BE REFERRED TO AS "PROHIBITED USES"):
          </Text>
          <Text style={styles.bodyText}>
            (I) UPLOAD TO OR CREATE ON THE SITE ANY PRODUCED CONTENT THAT VIOLATES ANY LAW, REGULATION, TREATY OR THIRD PARTY RIGHT (INCLUDING, WITHOUT LIMITATION, TRADE SECRET, INTELLECTUAL PROPERTY, PRIVACY, OR PUBLICITY RIGHTS);
          </Text>
          <Text style={styles.bodyText}>
            (II) PUBLISH FALSEHOODS OR MISREPRESENTATIONS THAT COULD DAMAGE HERO TRAVELER OR ANY THIRD PARTY;
          </Text>
          <Text style={styles.bodyText}>
            (III) POST, UPLOAD TO, OR CREATE ANY PRODUCED CONTENT THAT IS UNLAWFUL, OBSCENE, DEFAMATORY, LIBELOUS, THREATENING, PORNOGRAPHIC, VULGAR, HARASSING, HATEFUL, RACIALLY OR ETHNICALLY OFFENSIVE, OR ENCOURAGES CONDUCT THAT WOULD BE CONSIDERED A CRIMINAL OFFENSE, GIVE RISE TO CIVIL LIABILITY, VIOLATE ANY LAW, OR, IN HERO TRAVELER SOLE DISCRETION, IS OTHERWISE APPROPRIATE;
          </Text>
          <Text style={styles.bodyText}>
            (IV) IMPERSONATE ANOTHER PERSON OR ENTITY, WHETHER ACTUAL OR FICTITIOUS, FALSELY CLAIM AN AFFILIATION WITH ANY PERSON OR ENTITY, OR ACCESS THE HERO TRAVELER SERVICE ACCOUNTS OF OTHERS WITHOUT PERMISSION, MISREPRESENT THE SOURCE, IDENTITY, OR CONTENT OF INFORMATION TRANSMITTED VIA THE HERO TRAVELER SERVICE, OR PERFORM ANY OTHER SIMILAR FRAUDULENT ACTIVITY;
          </Text>
          <Text style={styles.bodyText}>
            (V) USE THE HERO TRAVELER WEBSITE FOR ANY PURPOSE OTHER THAN TO ACCESS THE TRAVELER SERVICE;
          </Text>
          <Text style={styles.bodyText}>
            (VI) CIRCUMVENT, DISABLE OR OTHERWISE INTERFERE WITH SECURITY-RELATED FEATURES OF THE HERO TRAVELER SERVICE OR FEATURES THAT PREVENT, LIMIT OR RESTRICT USE OR COPYING OF ANY MATERIALS OR ANOTHER USER'S PRODUCED CONTENT;
          </Text>
          <Text style={styles.bodyText}>
            (VII) RENT, LEASE, LOAN, SELL, RESELL, SUBLICENSE, DISTRBUTE OR OTHEWISE TRANSFER THE LICENSES GRANTED HEREIN OR ANY MATERIALS. FOR CLARITY, YOU MAY NOT ASSIGN, SELL, OR TRANSFER ANY PRODUCED CONTENT ON THE WEBSITE.
          </Text>
          <Text style={styles.bodyText}>
            (VIII) DELETE INDICATIONS OR NOTICES REGARDING THE COPYRIGHT OR OTHER PROPRIETARY RIGHTS ON THE ARTISTFAN SERVICE OR ANY THIRD PARTY CONTENT;
          </Text>
          <Text style={styles.bodyText}>
            (X) MAKE UNSOLICITED OFFERS, ADVERTISEMENTS, PROPOSALS, OR SEND JUNK MAIL OR SPAM TO OTHER USERS OF THE HERO TRAVELER SERVICE. THIS INCLUDES, BUT IS NOT LIMITED TO, UNSOLICITED ADVERTISING, PROMOTIONAL MATERIALS, OR OTHER SOLICITATION MATERIAL, BULK MAILING OF COMMERCIAL ADVERTISING, CHAIN MAIL, INFORMATIONAL ANNOUNCEMENTS, CHARITY REQUESTS, AND PETITIONS FOR SIGNATURES;
          </Text>
          <Text style={styles.bodyText}>
            (XI) USE THE HERO TRAVELER SERVICE FOR ANY ILLEGAL PURPOSE, OR IN VIOLATION OF ANY LOCAL, STATE, NATIONAL, OR INTERNATIONAL LAW, INCLUDING, WITHOUT LIMITATION, LAWS GOVERNING INTELLECTUAL PROPERTY AND OTHER PROPRIETARY RIGHTS, AND DATA PROTECTION AND PRIVACY;
          </Text>
          <Text style={styles.bodyText}>
            (XII) DEFAME, HARASS, ABUSE, THREATEN OR DEFRAUD USERS OF THE HERO TRAVELER SERVICE, OR COLLECT, OR ATTEMPT TO COLLECT, PERSONAL INFORMATION ABOUT USERS OR THIRD PARTIES WITHOUT THEIR CONSENT, OR, EXCEPT AS EXPRESSLY AUTHORIZED HEREIN, USE MATERIALS, THIRD PARTY PRODUCED CONTENT, OR OTHER CONTENT ON THE HERO TRAVELER SERVICE FOR ANY COMMERCIAL USE, IT BEING UNDERSTOOD THAT, OTHER THAN AS EXPRESSLY STATED HEREIN, THE MATERIALS, THIRD PARTY PRODUCED CONTENT AND OTHER CONTENT AVAILABLE ON THE HERO TRAVELER SERVICE IS FOR PERSONAL, NON-COMMERCIAL USE ONLY;
          </Text>
          <Text style={styles.bodyText}>
            (XIII) REVERSE ENGINEER, DECOMPILE, DISASSEMBLE OR OTHERWISE ATTEMPT TO DISCOVER THE SOURCE CODE OF THE HERO TRAVELER SERVICE OR ANY PART THEREOF, EXCEPT AND ONLY TO THE EXTENT THAT SUCH ACTIVITY IS EXPRESSLY PERMITTED BY APPLICABLE LAW NOTWITHSTANDING THIS LIMITATION;
          </Text>
          <Text style={styles.bodyText}>
            (XIV) MODIFY, ADAPT, TRANSLATE OR CREATE DERIVATIVE WORKS BASED UPON THE TRAVELER SERVICE OR ANY PART THEREOF, EXCEPT AND ONLY TO THE EXTENT THAT SUCH ACTIVITY IS EXPRESSLY PERMITTED BY APPLICABLE LAW NOTWITHSTANDING THIS LIMITATION;
          </Text>
          <Text style={styles.bodyText}>
            (XV) INTENTIONALLY INTERFERE WITH OR DAMAGE OPERATION OF THE HERO TRAVELER SERVICE OR ANY USER'S ENJOYMENT OF THEM, BY ANY MEANS, INCLUDING UPLOADING OR OTHERWISE DISSEMINATING VIRUSES, ADWARE, SPYWARE, WORMS, OR OTHER MALICIOUS CODE;
          </Text>
          <Text style={styles.bodyText}>
            (XVI) TAKE ANY ACTION THAT MAY UNDERMINE HERO TRAVELER RATING AND/OR COMMENT SYSTEMS (SUCH AS DISPLAYING, IMPORTING OR EXPORTING INFORMATION OFF THE HERO TRAVELER SERVICE, USING INFORMATION ON THE HERO TRAVELER SERVICE FOR PURPOSES UNRELATED TO THE HERO TRAVELER SERVICE, OR IMPROPERLY MANIPULATING OR USING THE RATINGS AND COMMENT SYSTEM);
          </Text>
          <Text style={styles.bodyText}>
            (XVII) TAKE ANY ACTION THAT IMPOSES OR MAY IMPOSE (IN ARTISTFAN’S SOLE DISCRETION) AN UNREASONABLE OR DISPROPORTIONATELY LARGE LOAD ON HERO TRAVELER COMPUTER SERVER INFRASTRUCTURE;
          </Text>
          <Text style={styles.bodyText}>
            (XVIII) INTERFERE OR ATTEMPT TO INTERFERE WITH THE PROPER WORKINGS OF HERO TRAVELER
          </Text>
          <Text style={styles.headerText}>
            7. Registration, Accounts and Passwords
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyNumberText}>7.1</Text> If you become a registered member and create an account on the Hero Traveler Service, you agree to be responsible and/or liable for: maintaining the confidentiality of passwords or other account identifiers which you choose; and all activities that occur under such password or account identifiers.
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyNumberText}>7.2</Text> You agree to notify Hero Traveler of: any loss of your password or account identifiers; and any unauthorized use of your password or account identifiers.
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyNumberText}>7.3</Text> Without limiting anything in this Agreement, Hero Traveler will not be responsible or liable, directly or indirectly, in any way for any loss or damage of any kind incurred as a result of, or in connection with, your failure to comply with this Section 7.
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyNumberText}>7.4</Text> You may not browse the Site and view Content without registering, you are required to register and select a password and screen name (“User ID”). You shall provide Hero Traveler with accurate, complete, and updated registration information. Failure to do so shall constitute a breach of the Terms of Use, which may result in immediate termination of your account. You shall not (i) select or use as a User ID or domain a name of another person with the intent to impersonate that person; (ii) use as a User ID or domain a name subject to any rights of a person other than you without appropriate authorization; or (iii) use as a User ID or domain a name that is otherwise offensive, vulgar or obscene. Hero Traveler reserves the right to refuse registration of, or cancel a User ID and domain in its sole discretion. You are solely responsible for activity that occurs on your account and shall be responsible for maintaining the confidentiality of your password. You shall never use another user’s account without such other user’s express permission. You will immediately notify Hero Traveler in writing of any unauthorized use of your account, or other account related security breach of which you are aware.
          </Text>
          <Text style={styles.headerText}>
            Governing Law & Venue
          </Text>
          <Text style={styles.bodyText}>
            These Terms of Use are governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law AND WILL SPECIFICALLY NOT BE GOVERNED BY THE UNITED NATIONS CONVENTIONS ON CONTRACTS FOR THE INTERNATIONAL SALE OF GOODS, IF OTHERWISE APPLICABLE. For any action at law or in equity relating to the arbitration provision of these Terms of Use, the Excluded Disputes or if you opt out of the agreement to arbitrate, you agree to resolve any dispute you have with Hero Traveler's exclusively in a state or federal court located in Santa Clara, California, and to submit to the personal jurisdiction of the courts located in Santa Clara County for the purpose of litigating all such disputes.
          </Text>
          <Text style={styles.bodyText}>
            If any provision of these Terms of Use is held to be unlawful, void, or for any reason unenforceable during arbitration or by a court of competent jurisdiction, then that provision will be deemed severable from these Terms of Use and will not affect the validity and enforceability of any remaining provisions. Hero Traveler's 's failure to insist upon or enforce strict performance of any provision of these Terms will not be construed as a waiver of any provision or right. No waiver of any of these Terms will be deemed a further or continuing waiver of such term or condition or any other term or condition. Hero Traveler's reserves the right to change this dispute resolution provision, but any such changes will not apply to disputes arising before the effective date of the amendment. This dispute resolution provision will survive the termination of any or all of your transactions with Instagram.
          </Text>
          <Text style={styles.headerText}>
            Entire Agreement
          </Text>
          <Text style={styles.bodyText}>
            If you are using the Service on behalf of a legal entity, you represent that you are authorized to enter into an agreement on behalf of that legal entity. These Terms of Use constitute the entire agreement between you and Hero Traveler's and governs your use of the Service, superseding any prior agreements between you and Hero Traveler's. You will not assign the Terms of Use or assign any rights or delegate any obligations hereunder, in whole or in part, whether voluntarily or by operation of law, without the prior written consent of Instagram. Any purported assignment or delegation by you without the appropriate prior written consent of Hero Traveler's will be null and void. Hero Traveler's may assign these Terms of Use or any rights hereunder without your consent. If any provision of these Terms of Use is found by a court of competent jurisdiction to be invalid or otherwise unenforceable, the parties nevertheless agree that such portion will be deemed severable from these Terms of Use and will not affect the validity and enforceability of the remaining provisions, and the remaining provisions of the Terms of Use remain in full force and effect. Neither the course of conduct between the parties nor trade practice will act to modify the Terms of Use. These Terms of Use do not confer any third-party beneficiary rights.
          </Text>
      </ScrollView>
    )
  }
}
