
begin;

drop publication if exists supabase_realtime;

create publication supabase_realtime;

alter publication supabase_realtime
    add table contracts;

alter publication supabase_realtime
    add table contract_bets;

alter publication supabase_realtime
    add table contract_comments;

alter publication supabase_realtime
    add table post_comments;

alter publication supabase_realtime
    add table group_contracts;

alter publication supabase_realtime
    add table group_members;

alter publication supabase_realtime
    add table user_notifications;

alter publication supabase_realtime
    add table user_contract_metrics;

alter publication supabase_realtime
    add table user_follows;

alter publication supabase_realtime
    add table private_user_message_channel_members;

commit;