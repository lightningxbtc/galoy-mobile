import { useMutation, gql } from "@apollo/client"
import * as React from "react"
import { View } from "react-native"
import { Input, Text } from "react-native-elements"
import EStyleSheet from "react-native-extended-stylesheet"
import { ScrollView } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/Ionicons"
import { CloseCross } from "../../components/close-cross"
import { IconTransaction } from "../../components/icon-transactions"
import { LargeButton } from "../../components/large-button"
import { Screen } from "../../components/screen"
import { translate } from "../../i18n"
import { palette } from "../../theme/palette"
import type { ContactStackParamList } from "../../navigation/stack-param-lists"
import { StackNavigationProp } from "@react-navigation/stack"
import { RouteProp } from "@react-navigation/native"
import type { ScreenType } from "../../types/jsx"
import { ContactTransactionsDataInjected } from "./contact-transactions"

const styles = EStyleSheet.create({
  actionsContainer: { paddingBottom: 18 },

  amount: {
    color: palette.white,
    fontSize: "40rem",
  },

  amountSecondary: {
    color: palette.white,
    fontSize: "16rem",
  },

  amountView: {
    alignItems: "center",
    paddingBottom: "24rem",
    paddingTop: "48rem",
  },

  icon: { margin: 0 },

  inputContainer: {
    flexDirection: "row",
  },

  inputStyle: { textAlign: "center", textDecorationLine: "underline" },

  screenTitle: { fontSize: 18, marginBottom: 12, marginTop: 18 },

  transactionsView: {
    flex: 1,
    marginHorizontal: "30rem",
  },
})

type ContactDetailProps = {
  route: RouteProp<ContactStackParamList, "contactDetail">
  navigation: StackNavigationProp<ContactStackParamList, "contactDetail">
}

export const ContactsDetailScreen: ScreenType = ({
  route,
  navigation,
}: ContactDetailProps) => {
  const { contact } = route.params
  return <ContactsDetailScreenJSX navigation={navigation} contact={contact} />
}

type ContactDetailScreenProps = {
  contact: Contact
  navigation: StackNavigationProp<ContactStackParamList, "contactDetail">
}

export const ContactsDetailScreenJSX: ScreenType = ({
  contact,
  navigation,
}: ContactDetailScreenProps) => {
  const [contactName, setContactName] = React.useState(contact.alias)

  const UPDATE_NAME = gql`
    mutation setName($username: String, $name: String) {
      updateContact {
        setName(username: $username, name: $name)
      }
    }
  `

  const [updateNameMutation] = useMutation(UPDATE_NAME)

  const updateName = () => {
    // TODO: need optimistic updates
    // FIXME this one doesn't work
    updateNameMutation({ variables: { username: contact.username, name: contactName } })
  }

  return (
    <Screen style={styles.screen} unsafe>
      <View style={[styles.amountView, { backgroundColor: palette.green }]}>
        <Icon
          name="ios-person-outline"
          size={94}
          color={palette.white}
          style={styles.icon}
        />
        <View style={styles.inputContainer}>
          <Input
            style={styles.amount}
            inputStyle={styles.inputStyle}
            inputContainerStyle={{ borderColor: palette.green }}
            onChangeText={setContactName}
            onSubmitEditing={updateName}
            onBlur={updateName}
            returnKeyType="done"
          >
            {contact.alias}
          </Input>
        </View>
        <Text style={styles.amountSecondary}>{`${translate("common.username")}: ${
          contact.username
        }`}</Text>
      </View>
      <ScrollView style={styles.transactionsView}>
        <Text style={styles.screenTitle}>
          {translate("ContactDetailsScreen.title", {
            input: contact.alias,
          })}
        </Text>
        <ContactTransactionsDataInjected
          navigation={navigation}
          contactUsername={contact.username}
        />
      </ScrollView>
      <View style={styles.actionsContainer}>
        <LargeButton
          title={translate("MoveMoneyScreen.send")}
          icon={<IconTransaction isReceive={false} size={32} />}
          onPress={() =>
            navigation.navigate("sendBitcoin", { username: contact.username })
          }
        />
      </View>
      <CloseCross color={palette.white} onPress={navigation.goBack} />
    </Screen>
  )
}