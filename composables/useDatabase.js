export const useDatabase = (supabase, data) => {
  const post_thought = async (supabase, content, tags) => {
    let arrayTags = tags.split(',');
    const thought_id = ref(0);
    // inserting thought
    try {
      const { error } = await supabase
        .from('thoughts')
        .insert({
          content: content,
        })
        .then((value) => {
          thogh_promise = await supabase
            .from('thoughts')
            .where({ content: content })
            .select('id')
            .then((value) => {
              thought_id.value = value;
              // dealing with tags
              try {
                arrayTags.forEach((tag) => {
                  // is tag already existing, if so grab ID
                  let tag_id = null;
                  let existing_tag = await supabase
                    .from('tags')
                    .where({ tag: tag })
                    .select('id')
                    .then((value) => {
                      // if there is no existing tag, insert one
                      if ((existing_tag.length = 0)) {
                        const { error } = await supabase
                          .from('tags')
                          .insert({ tag: data.content })
                          .then((value) => {
                            // grab ID of inserted tag
                            existing_tag = await supabase
                              .from('tags')
                              .where({ tag: tag })
                              .select('id')
                              .then((value) => {
                                tag_id = value;
                                // create row in join table, define relationship
                                const { error } = await supabase
                                  .from('thought_tag')
                                  .insert({
                                    thought_id: thought_id.value,
                                    tag_id: tag_id,
                                  });
                              });
                          });
                        console.log(error);
                        // if there is an existing tag, define new relationship
                      } else if (existing_tag.length > 0) {
                        const { error } = await supabase
                          .from('thought_tag')
                          .insert({
                            thought_id: thought_id.value,
                            tag_id: existing_tag[0],
                          });
                      }
                    });
                });
              } catch (error) {
                console.error(error);
              }
            });
        });
      console.log(error);
    } catch (error) {
      console.error(error);
    }
  };
  const retrieve_thought_tag = async (supabase) => {
    try {
      const { data, error } = await supabase.from('thoughts').select(`
        content,
        created_at,
        tags (
          tag
        )`);
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const format_date = (unFormDate) => {
    let dateString = unFormDate;
    const date = new Date(dateString);
    const options = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Australia/Sydney',
    };
    const formattedDate = date.toLocaleDateString('en-AU', options);
    return formattedDate;
  };
  const format_tags = (unFormTags) => {
    let tags = [];
    unFormTags.forEach((Objtag) => {
      tags.push(Objtag.tag);
    });
    return tags;
  };
  return {
    post_thought,
    retrieve_thought_tag,
    format_date,
    format_tags,
  };
};
